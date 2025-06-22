using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProductsAsyncApproved(int page = 1, int pageSize = 8);

        Task<int> CountTotalProductApproved();

        Task<Product?> GetDetailProductAsync(long id);

        Task<List<Product>> GetRelatedProductAsync(Product product);

        Task<List<Product>> Get10HotProducts();

        Task<List<Product>> Get5SaleProducts();
    }
}
