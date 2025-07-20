using ClothingShop_BE.ModelsDTO.Admin;

namespace ClothingShop_BE.Services.Admin.Orders
{
    public interface IOrderAdminService
    {
        Task<OrderListResultDTO> GetAllOrdersAsync(string? searchTerm, string? statusFilter, int page, int pageSize);
        Task<OrderDetailAdminDTO?> GetOrderDetailAsync(Guid orderId);
        Task<bool> UpdateOrderStatusAsync(Guid orderId, int newStatus);

    }

    public class OrderListResultDTO
    {
        public List<OrderAdminDTO> Orders { get; set; } = new List<OrderAdminDTO>();
        public int TotalCount { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
    }
} 