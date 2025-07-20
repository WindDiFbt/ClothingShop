using ClothingShop_BE.ModelsDTO.Admin.Analytics;

namespace ClothingShop_BE.Services.Admin.Analytics
{
    public interface IAnalyticsService
    {
        Task<DashboardOverviewDTO> GetDashboardOverviewAsync(DateTime? startDate, DateTime? endDate);
        Task<CategorySalesResponseDTO> GetCategorySalesAsync(DateTime? startDate, DateTime? endDate);
    }
} 