
using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IOrderRepository
    {
        // Existing methods
        Task<Order?> GetOrderAsync(Guid orderId);
        Task<bool> HasOrderExistAsync(Guid orderId);
        Task<bool> HasUserOrderedAsync(Guid userId, Guid orderId);
        // Lấy tất cả order (dùng cho PayOS webhook tìm theo prefix Guid)
        Task<List<Order>> GetAllOrdersAsync();

        // New methods for Sprint 2
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> GetOrderByIdAsync(Guid orderId);
        Task<List<Order>> GetOrdersByUserIdAsync(Guid userId);
        Task<Order?> UpdateOrderStatusAsync(Guid orderId, int status);
        Task<bool> CheckStockAvailabilityAsync(long productId, int quantity);
        Task<bool> ReduceProductStockAsync(long productId, int quantity);
        Task<bool> RestoreProductStockAsync(long productId, int quantity);
    }
}
