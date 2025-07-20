using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Orders;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderAdminService _orderService;
        private readonly ClothingShopPrn232G5Context _context;

        public OrdersController(IOrderAdminService orderService, ClothingShopPrn232G5Context context)
        {
            _orderService = orderService;
            _context = context;
        }

        // GET: api/admin/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderAdminDTO>>> GetAllOrders(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? statusFilter = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _orderService.GetAllOrdersAsync(searchTerm, statusFilter, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving orders",
                    error = ex.Message
                });
            }
        }

        // GET: api/admin/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailAdminDTO>> GetOrderDetail(Guid id)
        {
            try
            {
                var orderDetail = await _orderService.GetOrderDetailAsync(id);
                if (orderDetail == null)
                {
                    return NotFound(new { message = "Order not found" });
                }
                return Ok(orderDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving order detail",
                    error = ex.Message
                });
            }
        }

        // PUT: api/admin/orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDTO updateDto)
        {
            try
            {
                var result = await _orderService.UpdateOrderStatusAsync(id, updateDto.Status);
                if (!result)
                {
                    return NotFound(new { message = "Order not found" });
                }
                return Ok(new { message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while updating order status",
                    error = ex.Message
                });
            }
        }

        // GET: api/admin/orders/statuses
        [HttpGet("statuses")]
        public async Task<ActionResult<IEnumerable<OrderStatusDTO>>> GetOrderStatuses()
        {
            try
            {
                var statuses = await _context.OrderStatuses
                    .Select(s => new OrderStatusDTO
                    {
                        Id = s.Id,
                        Name = s.Name,
                       
                    })
                    .ToListAsync();
                return Ok(statuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving order statuses",
                    error = ex.Message
                });
            }
        }

  
    }
} 