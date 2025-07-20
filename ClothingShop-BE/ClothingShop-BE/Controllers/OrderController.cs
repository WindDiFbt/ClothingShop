using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using System.Security.Claims;

namespace ClothingShop_BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Create a new order from cart items
        /// </summary>
        [HttpPost("checkout")]
        public async Task<ActionResult<CheckoutResponseDTO>> Checkout([FromBody] CheckoutRequestDTO request)
        {
            try
            {
                // Debug authentication
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                Console.WriteLine($"Auth Header: {authHeader}");

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"User ID Claim: {userIdClaim}");
                Console.WriteLine($"User Identity IsAuthenticated: {User.Identity?.IsAuthenticated}");
                Console.WriteLine($"All Claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))}");

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest(new CheckoutResponseDTO
                    {
                        Success = false,
                        Message = "Invalid user ID",
                        OrderId = null
                    });
                }

                var result = await _orderService.CreateOrderAsync(request, userId);

                if (result.Success)
                    return Ok(result);
                else
                    return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new CheckoutResponseDTO
                {
                    Success = false,
                    Message = $"Internal server error: {ex.Message}",
                    OrderId = null
                });
            }
        }

        /// <summary>
        /// Get order by ID
        /// </summary>
        [HttpGet("{orderId:guid}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(Guid orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest("Invalid user ID");
                }

                var order = await _orderService.GetOrderByIdAsync(orderId, userId);
                if (order == null)
                {
                    return NotFound("Order not found");
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get all orders for the current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetUserOrders()
        {
            try
            {
                // Debug authentication for GET orders
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                Console.WriteLine($"[GetUserOrders] Auth Header: {authHeader}");
                Console.WriteLine($"[GetUserOrders] User Identity IsAuthenticated: {User.Identity?.IsAuthenticated}");
                Console.WriteLine($"[GetUserOrders] User Identity Name: {User.Identity?.Name}");
                Console.WriteLine($"[GetUserOrders] All Claims: {string.Join(", ", User.Claims.Select(c => $"{c.Type}={c.Value}"))}");

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"[GetUserOrders] User ID Claim: {userIdClaim}");

                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    Console.WriteLine($"[GetUserOrders] Failed to parse user ID: {userIdClaim}");
                    return BadRequest("Invalid user ID");
                }

                var orders = await _orderService.GetUserOrdersAsync(userId);
                Console.WriteLine($"[GetUserOrders] Found {orders?.Count ?? 0} orders for user {userId}");
                return Ok(orders);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetUserOrders] Exception: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Cancel an order (only if status is pending)
        /// </summary>
        [HttpPut("{orderId:guid}/cancel")]
        public async Task<ActionResult> CancelOrder(Guid orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest("Invalid user ID");
                }

                var success = await _orderService.CancelOrderAsync(orderId, userId);
                if (!success)
                {
                    return BadRequest("Unable to cancel order. Order may not exist or cannot be cancelled.");
                }

                return Ok(new { message = "Order cancelled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update order status (for admin use - you may want to add admin authorization)
        /// </summary>
        [HttpPut("{orderId:guid}/status")]
        public async Task<ActionResult<OrderDTO>> UpdateOrderStatus(Guid orderId, [FromBody] UpdateOrderStatusDTO request)
        {
            try
            {
                var order = await _orderService.UpdateOrderStatusAsync(orderId, request.Status);
                if (order == null)
                {
                    return NotFound("Order not found");
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("pagination")]
        public async Task<IActionResult> GetOrdersPagination(int page = 1, int pageSize = 8)
        {
            var (orders, currentPage, totalPages) = await _orderService.GetOrdersAsync(page, pageSize);
            return Ok(new { orders, currentPage, totalPages });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetail(Guid id)
        {
            var order = await _orderService.GetOrderDetailByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] int newStatus)
        {
            var updated = await _orderService.UpdateOrderStatusSellerAsync(id, newStatus);
            if (!updated) return NotFound();
            return NoContent();
        }


    }

    public class UpdateOrderStatusDTO
    {
        public int Status { get; set; }
    }
}
