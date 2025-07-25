using ClothingShop_BE.Helpers;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NuGet.Protocol.Core.Types;
using System.Security.Claims;

namespace ClothingShop_BE.Service.Impl
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProductStatusRepository _productStatusRepository;
        private readonly IMemoryCache _cache;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ProductConfig _config;
        public ProductService(IProductRepository productRepository, IFeedbackRepository feedbackRepository,
            ICategoryRepository categoryRepository, IProductStatusRepository productStatusRepository,
            IMemoryCache cache, IHttpContextAccessor httpContextAccessor, ProductConfig config)
        {
            _productRepository = productRepository;
            _feedbackRepository = feedbackRepository;
            _categoryRepository = categoryRepository;
            _productStatusRepository = productStatusRepository;
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _config = config;
        }

        public IQueryable<Product> GetAllProductsODATA()
        {
            return _productRepository.GetAllProductsApprovedForODATA();
        }

        public async Task<(IEnumerable<ProductDTO> Products, int CurrentPage, int TotalPages)> GetProductsAsync(int page, int pageSize)
        {
            int totalProducts = await _productRepository.CountTotalProductApproved();
            List<ProductDTO> products = (await _productRepository.GetAllProductsAsyncApprovedWithPagination())
                .Select(x => new ProductDTO(x)).ToList();
            int totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);
            return (products, page, totalPages);
        }

        public async Task<(ProductDTO Products, object seller, IEnumerable<ProductDTO> relatedProducts, IEnumerable<FeedbackDTO> feedbacks)> GetDetailProductsAsync(long id)
        {
            var product = await _productRepository.GetDetailProductAsync(id);
            if (product == null)
            {
                throw new KeyNotFoundException($"Product does not exist ID: {id}");
            }
            var productDto = new ProductDTO(product);
            var relatedProducts = (await _productRepository.GetRelatedProductAsync(product)).Select(x => new ProductDTO(x)).ToList();
            var feedbacks = (await _feedbackRepository.Get3FeedbackNewestAsync(id)).Select(x => new FeedbackDTO(x)).ToList();
            var seller = new
            {
                Id = product.Seller.Id,
                AvatarUrl = product.Seller.Userinfo.AvatarUrl,
                Username = product.Seller.UserName,
                FullName = product.Seller.Userinfo.FullName
            };
            return (productDto, seller, relatedProducts, feedbacks);
        }

        public async Task<IEnumerable<CategoryDTO>> GetCategoriesAsync()
        {
            if (!_cache.TryGetValue("categories", out List<CategoryDTO>? categories))
            {
                categories = (await _categoryRepository.GetAllCategoriesAsync()).Select(x => new CategoryDTO(x)).ToList();
                _cache.Set("categories", categories, TimeSpan.FromMinutes(10));
            }
            return categories!;
        }

        public async Task<IEnumerable<ProductStatusDTO>> GetProductStatusesAsync()
        {
            if (!_cache.TryGetValue("statuses", out List<ProductStatusDTO>? statuses))
            {
                statuses = (await _productStatusRepository.GetAllProductStatusAsync()).Select(x => new ProductStatusDTO(x)).ToList();
                _cache.Set("statuses", statuses, TimeSpan.FromMinutes(10));
            }
            return statuses!;
        }

        public async Task<(IEnumerable<ProductDTO> hotproducts, IEnumerable<ProductDTO> saleProducts)> GetProductsHomePageAsync()
        {
            List<ProductDTO> hotproducts = (await _productRepository.Get10HotProducts()).Select(x => new ProductDTO(x)).ToList();
            List<ProductDTO> saleProducts = (await _productRepository.Get5SaleProducts()).Select(x => new ProductDTO(x)).ToList();
            return (hotproducts, saleProducts);
        }
        public async Task<ProductDTO> CreateProductAsync(ProductDTO dto)
        {
            var product = dto.ToProduct();
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out Guid userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing user ID in token.");
            }

            product.SellerId = userId;
            product.Status = 1;
            await _productRepository.CreateProductAsync(product);
            return new ProductDTO(product);
        }
        public async Task<ProductDTO> UpdateProductAsync(long id, ProductDTO dto)
        {
            var existingProduct = await _productRepository.GetDetailProductAsync(id);
            if (existingProduct == null)
            {
                throw new KeyNotFoundException($"Product does not exist ID: {id}");
            }

            existingProduct.Name = dto.Name;
            existingProduct.Description = dto.Description;
            existingProduct.Price = dto.Price;
            existingProduct.Discount = dto.Discount;
            existingProduct.Status = dto.Status ?? 1;
            existingProduct.CategoryId = dto.CategoryId;
            existingProduct.ThumbnailUrl = dto.ThumbnailUrl;

            existingProduct.Images = dto.Images.Select(url => new Image
            {
                Url = url
            }).ToList();

            existingProduct.ProductVariants = dto.ProductVariants.Select(v => new ProductVariant
            {
                Size = v.Size,
                Quantity = v.Quantity
            }).ToList();

            await _productRepository.UpdateProductAsync(existingProduct);

            return new ProductDTO(existingProduct);
        }
        public async Task<List<ProductStockDto>> GetProductStockStatusAsync()
        {
             int LOW_STOCK_THRESHOLD = _config.StockStatus.LowThreshold;
             int HIGH_STOCK_THRESHOLD = _config.StockStatus.HighThreshold;

            var products = await _productRepository.GetAllWithVariantsAsync();

            var result = products.Select(p => new ProductStockDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Variants = p.ProductVariants.Select(v => new ProductVariantStockDto
                {
                    VariantId = v.Id,
                    Size = v.Size,
                    Quantity = v.Quantity ?? 0,
                    StockStatus = GetStockStatus(v.Quantity ?? 0, LOW_STOCK_THRESHOLD, HIGH_STOCK_THRESHOLD)
                }).ToList()
            }).ToList();

            return result;
        }

        private string GetStockStatus(int quantity, int low, int high)
        {
            if (quantity < low)
                return _config.StockStatus.LowLabel;
            if (quantity > high)
                return _config.StockStatus.HighLabel;
            return _config.StockStatus.NormalLabel;
        }
        public Task<List<ProductSuggestionDTO>> GetBestSellingByMonth(int month, int year) =>
       _productRepository.GetBestSellingProductsByMonthAsync(month, year);

        public Task<List<ProductSuggestionDTO>> GetBestSellingByYear(int year) =>
            _productRepository.GetBestSellingProductsByYearAsync(year);

        public Task<List<ProductSuggestionDTO>> GetImportRecommendation() =>
            _productRepository.GetImportRecommendationAsync();

        public Task<List<ProductSuggestionDTO>> GetLimitRecommendation() =>
            _productRepository.GetLimitRecommendationAsync();
        public async Task UpdateProductStatusAsync(long productId, int newStatusId) =>
            _productRepository.UpdateProductStatusAsync(productId, newStatusId);
        

    }
}
