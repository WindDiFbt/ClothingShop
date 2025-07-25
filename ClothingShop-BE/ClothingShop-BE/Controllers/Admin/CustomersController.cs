using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/customers")]
    [ApiController]
    [Authorize(Roles = "ADMIN,ADMIN_BUSINESS")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerAdminService _customerService;

        public CustomersController(ICustomerAdminService customerService)
        {
            _customerService = customerService;
        }

        // GET: api/admin/customers
        [HttpGet]
        public async Task<ActionResult<CustomerListResultDTO>> GetAllCustomers(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? statusFilter = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _customerService.GetAllCustomersAsync(searchTerm, statusFilter, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/admin/customers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDetailDTO>> GetCustomerDetail(Guid id)
        {
            try
            {
                var customer = await _customerService.GetCustomerDetailAsync(id);
                if (customer == null)
                    return NotFound(new { message = "Customer not found" });

                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // PUT: api/admin/customers/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateCustomerStatus(Guid id, [FromBody] UpdateCustomerStatusDTO statusDto)
        {
            try
            {
                Console.WriteLine($"Updating customer {id} with status {statusDto.Status}");
                
                if (statusDto == null)
                {
                    return BadRequest(new { message = "Status data is required" });
                }

                if (statusDto.Status < 1 || statusDto.Status > 3)
                {
                    return BadRequest(new { message = "Invalid status value. Must be 1, 2, or 3" });
                }

                var result = await _customerService.UpdateCustomerStatusAsync(id, statusDto.Status);
                if (!result)
                    return NotFound(new { message = "Customer not found" });

                return Ok(new { message = "Customer status updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Controller error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/admin/customers/{id}/orders
        [HttpGet("{id}/orders")]
        public async Task<ActionResult<List<CustomerOrderDTO>>> GetCustomerOrders(Guid id)
        {
            try
            {
                var orders = await _customerService.GetCustomerOrdersAsync(id);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/admin/customers/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<CustomerStatisticsDTO>> GetCustomerStatistics()
        {
            try
            {
                var statistics = await _customerService.GetCustomerStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
