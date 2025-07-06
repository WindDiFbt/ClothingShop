using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface ICartRepository
    {
        Task<Cart> GetCartByUserIdAsync(Guid userId);
        Task<CartDetail> AddOrUpdateItemAsync(Guid userId, long productId, int quantity);
        Task RemoveItemAsync(Guid userId, long productId);
        Task ClearCartAsync(Guid userId);
    }
} 