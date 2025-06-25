using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderAsync(Guid orderId);

        Task<bool> HasOrderExistAsync(Guid orderId);

        Task<bool> HasUserOrderedAsync(Guid userId, Guid ordeId);
    }
}
