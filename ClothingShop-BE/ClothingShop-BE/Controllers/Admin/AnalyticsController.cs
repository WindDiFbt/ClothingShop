using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin.Analytics;
using ClothingShop_BE.Services.Admin.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/analytics")]
    [ApiController]
    [Authorize(Roles ="ADMIN_BUSINESS")]
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

    }
}
