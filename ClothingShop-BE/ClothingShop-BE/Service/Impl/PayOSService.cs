using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Models;
using ClothingShop_BE.Repository;

namespace ClothingShop_BE.Service.Impl
{
    public class PayOSService : IPayOSService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IOrderRepository _orderRepository;
        private readonly string _clientId;
        private readonly string _apiKey;
        private readonly string _checksumKey;
        private readonly string _baseUrl;

        public PayOSService(
            HttpClient httpClient,
            IConfiguration configuration,
            IOrderRepository orderRepository)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _orderRepository = orderRepository;

            _clientId = _configuration["PayOS:ClientId"] ?? throw new ArgumentNullException("PayOS:ClientId");
            _apiKey = _configuration["PayOS:ApiKey"] ?? throw new ArgumentNullException("PayOS:ApiKey");
            _checksumKey = _configuration["PayOS:ChecksumKey"] ?? throw new ArgumentNullException("PayOS:ChecksumKey");
            _baseUrl = _configuration["PayOS:BaseUrl"] ?? "https://api-merchant.payos.vn";

            // Configure HttpClient
            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.DefaultRequestHeaders.Add("x-client-id", _clientId);
            _httpClient.DefaultRequestHeaders.Add("x-api-key", _apiKey);
        }

        public async Task<PayOSCreatePaymentResponse> CreatePaymentLinkAsync(PayOSCreatePaymentRequest request)
        {
            try
            {
                // Generate signature
                var dataToSign = $"amount={request.Amount}&cancelUrl={request.CancelUrl}&description={request.Description}&orderCode={request.OrderCode}&returnUrl={request.ReturnUrl}";
                request.Signature = GenerateSignature(dataToSign);

                var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("/v2/payment-requests", content);
                var responseJson = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"PayOS Create Payment Response: {responseJson}");

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<PayOSCreatePaymentResponse>(responseJson, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    return result ?? throw new Exception("Failed to deserialize PayOS response");
                }
                else
                {
                    throw new Exception($"PayOS API Error: {response.StatusCode} - {responseJson}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Create Payment Error: {ex.Message}");
                throw;
            }
        }

        public async Task<PayOSPaymentInfo> GetPaymentInfoAsync(string paymentLinkId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/v2/payment-requests/{paymentLinkId}");
                var responseJson = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"PayOS Get Payment Info Response: {responseJson}");

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<PayOSPaymentInfo>(responseJson, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    return result ?? throw new Exception("Failed to deserialize PayOS payment info");
                }
                else
                {
                    throw new Exception($"PayOS API Error: {response.StatusCode} - {responseJson}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Get Payment Info Error: {ex.Message}");
                throw;
            }
        }

        public async Task<PayOSPaymentInfo> CancelPaymentLinkAsync(string paymentLinkId, string cancellationReason)
        {
            try
            {
                var cancelRequest = new { cancellationReason };
                var json = JsonSerializer.Serialize(cancelRequest, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"/v2/payment-requests/{paymentLinkId}/cancel", content);
                var responseJson = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"PayOS Cancel Payment Response: {responseJson}");

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<PayOSPaymentInfo>(responseJson, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    return result ?? throw new Exception("Failed to deserialize PayOS cancel response");
                }
                else
                {
                    throw new Exception($"PayOS API Error: {response.StatusCode} - {responseJson}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Cancel Payment Error: {ex.Message}");
                throw;
            }
        }

        public bool VerifyWebhookSignature(string signature, string data)
        {
            try
            {
                // Parse body JSON, lấy object data
                using var doc = JsonDocument.Parse(data);
                if (!doc.RootElement.TryGetProperty("data", out var dataElement))
                {
                    Console.WriteLine("Webhook body missing 'data' property");
                    return false;
                }

                // Chuyển data thành Dictionary<string, object>
                var dict = new SortedDictionary<string, string>();
                foreach (var prop in dataElement.EnumerateObject())
                {
                    // Bỏ qua các trường null
                    if (prop.Value.ValueKind != JsonValueKind.Null)
                        dict[prop.Name] = prop.Value.ToString();
                }

                // Nối lại thành chuỗi key1=value1&key2=value2...
                var sb = new StringBuilder();
                foreach (var kv in dict)
                {
                    sb.Append(kv.Key).Append('=').Append(kv.Value).Append('&');
                }
                if (sb.Length > 0) sb.Length--; // Bỏ dấu & cuối
                var dataToSign = sb.ToString();

                var expectedSignature = GenerateSignature(dataToSign);
                return signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Verify Signature Error: {ex.Message}");
                return false;
            }
        }

        public string GenerateSignature(string data)
        {
            try
            {
                using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_checksumKey));
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return Convert.ToHexString(hash).ToLowerInvariant();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Generate Signature Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> ProcessWebhookAsync(PayOSWebhookData webhookData)
        {
            try
            {
                if (webhookData.Data == null) return false;

                // Find order by OrderCode (so sánh 10 ký tự đầu của Guid)
                var orderCode = webhookData.Data.OrderCode;
                var guidPrefix = orderCode.ToString("x").PadLeft(10, '0');
                Console.WriteLine($"[Webhook] OrderCode: {orderCode} => Guid prefix: {guidPrefix}");

                // Lấy tất cả order, tìm order có Guid.ToString("N").StartsWith(guidPrefix)
                var allOrders = await _orderRepository.GetAllOrdersAsync();
                var order = allOrders.FirstOrDefault(o => o.Id.ToString("N").StartsWith(guidPrefix, StringComparison.OrdinalIgnoreCase));

                if (order == null)
                {
                    Console.WriteLine($"Order not found for OrderCode: {orderCode} (prefix: {guidPrefix})");
                    return false;
                }

                // Update order status based on payment status
                var newStatus = webhookData.Code switch
                {
                    "00" => 2, // Payment successful -> Processing
                    "01" => 4, // Payment failed -> Cancelled
                    _ => order.Status // Keep current status for other codes
                };

                if (newStatus != order.Status)
                {
                    await _orderRepository.UpdateOrderStatusAsync(order.Id, newStatus ?? 0);
                    Console.WriteLine($"Updated order {order.Id} status to {newStatus}");
                }

                // Log payment transaction
                Console.WriteLine($"PayOS Webhook processed for Order: {order.Id}, Status: {webhookData.Code}, Amount: {webhookData.Data.Amount}");

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"PayOS Process Webhook Error: {ex.Message}");
                return false;
            }
        }
    }
}
