using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface ICartService
    {
        Task<CartDTO> GetCartAsync(Guid userId);
        Task<CartDTO> AddOrUpdateItemAsync(Guid userId, long productId, int quantity);
        Task RemoveItemAsync(Guid userId, long productId);
        Task ClearCartAsync(Guid userId);
    }
} 