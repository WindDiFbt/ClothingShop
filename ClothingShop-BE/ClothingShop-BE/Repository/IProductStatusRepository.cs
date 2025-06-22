using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IProductStatusRepository
    {
        Task<List<ProductStatus>> GetAllProductStatusAsync();
    }
}
