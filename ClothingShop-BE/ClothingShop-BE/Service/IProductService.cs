using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface IProductService
    {
        IQueryable<Product> GetAllProductsODATA();

        Task<(IEnumerable<ProductDTO> Products, int CurrentPage, int TotalPages)> GetProductsAsync(int page, int pageSize);

        Task<(ProductDTO Products, object seller, IEnumerable<ProductDTO> relatedProducts, IEnumerable<FeedbackDTO> feedbacks)> GetDetailProductsAsync(long id);

        Task<IEnumerable<CategoryDTO>> GetCategoriesAsync();

        Task<IEnumerable<ProductStatusDTO>> GetProductStatusesAsync();

        Task<(IEnumerable<ProductDTO> hotproducts, IEnumerable<ProductDTO> saleProducts)> GetProductsHomePageAsync();

        Task<ProductDTO> CreateProductAsync(ProductDTO dto);
        Task<ProductDTO> UpdateProductAsync(long id, ProductDTO dto);

    }
}
