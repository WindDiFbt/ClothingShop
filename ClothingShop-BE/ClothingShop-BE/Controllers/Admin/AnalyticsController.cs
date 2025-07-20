using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin.Analytics;
using ClothingShop_BE.Services.Admin.Analytics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/analytics")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly ClothingShopPrn232G5Context _context;
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(ClothingShopPrn232G5Context context, IAnalyticsService analyticsService)
        {
            _context = context;
            _analyticsService = analyticsService;
        }

        [HttpGet("dashboard/overview")]
        public async Task<ActionResult<DashboardOverviewDTO>> GetDashboardOverview(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var result = await _analyticsService.GetDashboardOverviewAsync(startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu dashboard", error = ex.Message });
            }
        }

        [HttpGet("category-sales")]
        public async Task<ActionResult<CategorySalesResponseDTO>> GetCategorySales(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate)
        {
            try
            {
                var result = await _analyticsService.GetCategorySalesAsync(startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu doanh số theo danh mục", error = ex.Message });
            }
        }

        [HttpGet("customers/summary")]
        public async Task<IActionResult> GetCustomerSummary()
        {
            var result = await _context.Users
                .Include(u => u.Userinfo)
                .Include(u => u.Orders)
                .Include(u => u.StatusNavigation)
                .Select(c => new CustomerSummaryDTO
                {
                    CustomerId = c.Id,
                    UserName = c.UserName,
                    Email = c.Email,
                    Status = c.Status,
                    StatusName = c.StatusNavigation.StatusName,
                    FullName = c.Userinfo.FullName,
                    PhoneNumber = c.Userinfo.PhoneNumber,
                    Address = c.Userinfo.Address,
                    Gender = c.Userinfo.Gender,

                    // Order statistics
                    TotalOrders = c.Orders.Count(),
                    CompletedOrders = c.Orders.Count(o => o.Status == 4), // Assuming 4 is completed status
                    CancelledOrders = c.Orders.Count(o => o.Status == 5), // Assuming 5 is cancelled status
                    TotalSpent = c.Orders.Where(o => o.Status == 4).Sum(o => o.TotalAmount) ?? 0,

                    // Dates
                    LastPurchaseDate = c.Orders
                        .Where(o => o.Status == 4)
                        .Max(o => o.OrderDate),
                    RegistrationDate = c.CreatedAt,

                    // Activity metrics
                    FeedbackCount = c.Feedbacks.Count(),
                    AverageRating = c.Feedbacks.Average(f => (decimal?)f.Rating) ?? 0,
                    WishlistCount = c.Wishlists.Count(w => w.IsDeleted != 1)
                })
                .ToListAsync();

            var enhancedResult = result.Select(customer => {
                // Calculate additional derived metrics
                customer.AverageOrderValue = customer.TotalOrders > 0
                    ? customer.TotalSpent / customer.TotalOrders
                    : 0;

                customer.OrderCompletionRate = customer.TotalOrders > 0
                    ? (decimal)customer.CompletedOrders / customer.TotalOrders * 100
                    : 0;

                return customer;
            });

            return Ok(enhancedResult);
        }
    }
}
