using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClothingShop_BE.Service;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Repository;
using System.Security.Claims;
using System.Text.Json;

namespace ClothingShop_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase

    {
        private readonly IPayOSService _payOSService;
        private readonly IOrderRepository _orderRepository;
        private readonly IConfiguration _configuration;

        public PaymentController(
            IPayOSService payOSService,
            IOrderRepository orderRepository,
            IConfiguration configuration)
        {
            _payOSService = payOSService;
            _orderRepository = orderRepository;
            _configuration = configuration;
        }

        // Helper: Convert Guid to OrderCode (long)
        private static long GuidToOrderCode(Guid guid)
        {
            var hex10 = guid.ToString("N").Substring(0, 10);
            return long.Parse(hex10, System.Globalization.NumberStyles.HexNumber);
        }

        // Helper: Convert OrderCode (long) back to Guid prefix (10 hex chars)
        private static string OrderCodeToGuidPrefix(long orderCode)
        {
            return orderCode.ToString("x").PadLeft(10, '0');
        }

        [HttpPost("payos/create")]
        [Authorize]
        public async Task<IActionResult> CreatePayOSPayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                // Validate user
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user" });
                }

                // Get order details
                var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
                if (order == null)
                {
                    return NotFound(new { message = "Order not found" });
                }

                if (order.CustomerId != userId)
                {
                    return Forbid("Access denied");
                }

                if (order.Status != 1) // Only allow payment for pending orders
                {
                    return BadRequest(new { message = "Order is not in a payable state" });
                }

                // Create PayOS payment request
                var frontendUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
                var payOSRequest = new PayOSCreatePaymentRequest
                {
                    OrderCode = GuidToOrderCode(order.Id),
                    Amount = (int)(order.TotalAmount ?? 0),
                    Description = $"DH{order.Id.ToString()[..8]}", // Rút ngọn để <= 25 ký tự
                    BuyerName = order.FullName,
                    BuyerPhone = order.PhoneNumber,
                    BuyerAddress = order.Address,
                    Items = order.OrderDetails?.Select(od => new PayOSItem
                    {
                        Name = od.Product?.Name ?? "Product",
                        Quantity = od.Quantity ?? 1,
                        Price = (int)(od.UnitPrice ?? 0)
                    }).ToList() ?? new List<PayOSItem>(),
                    CancelUrl = $"{frontendUrl}/payment/cancel?orderId={order.Id}",
                    ReturnUrl = $"{frontendUrl}/payment/success?orderId={order.Id}",
                    ExpiredAt = DateTimeOffset.UtcNow.AddMinutes(15).ToUnixTimeSeconds()
                };

                var response = await _payOSService.CreatePaymentLinkAsync(payOSRequest);

                if (response.Code == "00" && response.Data != null)
                {
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            checkoutUrl = response.Data.CheckoutUrl,
                            paymentLinkId = response.Data.PaymentLinkId,
                            qrCode = response.Data.QrCode,
                            amount = response.Data.Amount,
                            orderCode = response.Data.OrderCode
                        }
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = response.Desc ?? "Failed to create payment link"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Create PayOS Payment Error: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Internal server error"
                });
            }
        }

        [HttpGet("payos/status/{paymentLinkId}")]
        [Authorize]
        public async Task<IActionResult> GetPaymentStatus(string paymentLinkId)
        {
            try
            {
                var paymentInfo = await _payOSService.GetPaymentInfoAsync(paymentLinkId);

                if (paymentInfo.Code == "00" && paymentInfo.Data != null)
                {
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            status = paymentInfo.Data.Status,
                            amount = paymentInfo.Data.Amount,
                            amountPaid = paymentInfo.Data.AmountPaid,
                            amountRemaining = paymentInfo.Data.AmountRemaining,
                            orderCode = paymentInfo.Data.OrderCode,
                            transactions = paymentInfo.Data.Transactions
                        }
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = paymentInfo.Desc ?? "Failed to get payment status"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Get Payment Status Error: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Internal server error"
                });
            }
        }

        [HttpPost("payos/webhook")]
        public async Task<IActionResult> PayOSWebhook()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                Console.WriteLine($"PayOS Webhook received: {body}");

                // In ra toàn bộ headers để debug
                foreach (var h in Request.Headers)
                {
                    Console.WriteLine($"Header: {h.Key} = {h.Value}");
                }

                // Lấy signature từ header hoặc body
                var signature = Request.Headers["signature"].FirstOrDefault()
                    ?? Request.Headers["Signature"].FirstOrDefault()
                    ?? Request.Headers["X-Signature"].FirstOrDefault();

                if (string.IsNullOrEmpty(signature))
                {
                    // Nếu không có ở header, thử lấy ở body (trường signature ở root)
                    try
                    {
                        using var doc = JsonDocument.Parse(body);
                        if (doc.RootElement.TryGetProperty("signature", out var sigProp))
                        {
                            signature = sigProp.GetString();
                        }
                    }
                    catch { }
                }

                if (string.IsNullOrEmpty(signature))
                {
                    Console.WriteLine("Missing signature in webhook (header + body)");
                    return BadRequest("Missing signature");
                }

                if (!_payOSService.VerifyWebhookSignature(signature, body))
                {
                    Console.WriteLine("Invalid webhook signature");
                    return BadRequest("Invalid signature");
                }

                // Parse webhook data
                var webhookData = JsonSerializer.Deserialize<PayOSWebhookData>(body, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                if (webhookData == null)
                {
                    Console.WriteLine("Invalid webhook data");
                    return BadRequest("Invalid webhook data");
                }

                // Phân giải OrderCode về 10 ký tự đầu của Guid (nếu cần)
                if (webhookData.Data != null)
                {
                    var orderCode = webhookData.Data.OrderCode;
                    var guidPrefix = OrderCodeToGuidPrefix(orderCode); // 10 ký tự hex đầu của Guid
                    Console.WriteLine($"OrderCode {orderCode} => Guid prefix: {guidPrefix}");
                    // Nếu cần tìm order theo Guid, có thể so sánh guidPrefix với Guid.ToString("N").Substring(0,10)
                }

                // Process webhook
                var processed = await _payOSService.ProcessWebhookAsync(webhookData);

                if (processed)
                {
                    return Ok(new { message = "Webhook processed successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Failed to process webhook" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Webhook Error: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("payos/cancel/{paymentLinkId}")]
        [Authorize]
        public async Task<IActionResult> CancelPayment(string paymentLinkId, [FromBody] CancelPaymentRequest request)
        {
            try
            {
                var result = await _payOSService.CancelPaymentLinkAsync(paymentLinkId, request.Reason ?? "User cancelled");

                if (result.Code == "00")
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Payment cancelled successfully"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.Desc ?? "Failed to cancel payment"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Cancel Payment Error: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Internal server error"
                });
            }
        }
    }

    public class CreatePaymentRequest
    {
        public Guid OrderId { get; set; }
    }

    public class CancelPaymentRequest
    {
        public string? Reason { get; set; }
    }
}
