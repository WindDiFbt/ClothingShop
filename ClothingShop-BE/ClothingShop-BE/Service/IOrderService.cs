using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface IOrderService
    {
        Task<CheckoutResponseDTO> CreateOrderAsync(CheckoutRequestDTO request, Guid userId);
        Task<OrderDTO?> GetOrderByIdAsync(Guid orderId, Guid userId);
        Task<List<OrderDTO>> GetUserOrdersAsync(Guid userId);
        Task<OrderDTO?> UpdateOrderStatusAsync(Guid orderId, int status);
        Task<bool> CancelOrderAsync(Guid orderId, Guid userId);
        Task<bool> ValidateCheckoutAsync(CheckoutRequestDTO request);
        IQueryable<Order> GetAllOrdersODATA();
        Task<(List<OrderDTO> orders, int currentPage, int totalPages)> GetOrdersAsync(int page, int pageSize);
        Task<OrderDTO?> GetOrderDetailByIdAsync(Guid orderId);
        Task<bool> UpdateOrderStatusSellerAsync(Guid orderId, int newStatus);
        IQueryable<Order> GetAllOrdersOData();
        Task<List<ProductRevenueDTO>> GetTopSellingProductsAsync();

    }
}
