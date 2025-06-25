using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IOrderDetailRepository
    {
        Task<OrderDetail> GetOrderDetailAsync(Guid orderId);

        Task<bool> HasOrderDetailExistAsync(Guid orderId, long productId);
    }
}
