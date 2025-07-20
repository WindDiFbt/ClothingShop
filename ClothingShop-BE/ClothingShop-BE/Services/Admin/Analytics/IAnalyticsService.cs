using ClothingShop_BE.ModelsDTO.Admin.Analytics;

namespace ClothingShop_BE.Services.Admin.Analytics
{
    public interface IAnalyticsService
    {
        Task<DashboardOverviewDTO> GetDashboardOverviewAsync(DateTime? startDate, DateTime? endDate);
        Task<RevenueAnalyticsDTO> GetRevenueAnalyticsAsync(DateTime? startDate, DateTime? endDate);
        Task<OrderAnalyticsDTO> GetOrderAnalyticsAsync(DateTime? startDate, DateTime? endDate);
        Task<CustomerAnalyticsDTO> GetCustomerAnalyticsAsync(DateTime? startDate, DateTime? endDate);
        Task<ProductAnalyticsDTO> GetProductAnalyticsAsync(DateTime? startDate, DateTime? endDate);
        
    }
} 