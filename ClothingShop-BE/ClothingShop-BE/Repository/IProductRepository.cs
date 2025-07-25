using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
namespace ClothingShop_BE.Repository
{
    public interface IProductRepository
    {
        IQueryable<Product> GetAllProductsApprovedForODATA();

        Task<List<Product>> GetAllProductsAsyncApprovedWithPagination(int page = 1, int pageSize = 8);

        Task<int> CountTotalProductApproved();

        Task<Product?> GetDetailProductAsync(long id);

        Task<List<Product>> GetRelatedProductAsync(Product product);

        Task<List<Product>> Get10HotProducts();

        Task<List<Product>> Get5SaleProducts();
        Task CreateProductAsync(Product product);
        Task UpdateProductAsync(Product product);
        Task<List<Product>> GetAllWithVariantsAsync();
        Task<List<ProductSuggestionDTO>> GetBestSellingProductsByMonthAsync(int month, int year);
        Task<List<ProductSuggestionDTO>> GetBestSellingProductsByYearAsync(int year);
        Task<List<ProductSuggestionDTO>> GetImportRecommendationAsync();
        Task<List<ProductSuggestionDTO>> GetLimitRecommendationAsync();

    }
}
