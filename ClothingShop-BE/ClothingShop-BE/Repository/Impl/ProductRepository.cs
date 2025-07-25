using ClothingShop_BE.Helpers;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class ProductRepository : IProductRepository
    {
        private readonly ClothingShopPrn232G5Context _context;
        private readonly ProductConfig _config;
        public ProductRepository(ClothingShopPrn232G5Context context, ProductConfig config)
        {
            _context = context;
            _config = config;
        }

        public async Task<List<Product>> GetAllProductsAsyncApprovedWithPagination(int page = 1, int pageSize = 8) =>
            await _context.Products
                .Where(p => p.Status == 1)
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

        public async Task<int> CountTotalProductApproved() =>
            await _context.Products.CountAsync(p => p.Status == 1);

        public async Task<Product?> GetDetailProductAsync(long id) =>
            await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                .Include(p => p.Seller)
                    .ThenInclude(p => p.Userinfo)
                .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<List<Product>> GetRelatedProductAsync(Product product) =>
            await _context.Products
                .Where(p => p.Status == 1)
                .Where(p => p.CategoryId == product.CategoryId || p.SellerId == product.SellerId && p.Id != product.Id)
                .Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    ThumbnailUrl = p.ThumbnailUrl,
                    Discount = p.Discount,
                })
                .Take(5)
                .ToListAsync();

        public async Task<List<Product>> Get10HotProducts() =>
             await _context.Products
                .Where(p => p.Discount == 0)
                .Take(10)
                .ToListAsync();

        public async Task<List<Product>> Get5SaleProducts() =>
            await _context.Products
                .Where(p => p.Discount > 0)
                .OrderByDescending(p => p.Discount)
                .Take(5)
                .ToListAsync();

        public IQueryable<Product> GetAllProductsApprovedForODATA() =>
            _context.Products.Where(p => p.Status == 1);
        public async Task CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateProductAsync(Product product)
        {
            product.Status = 1;
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Product>> GetAllWithVariantsAsync()
        {
            return await _context.Products
                .Include(p => p.ProductVariants)
                .ToListAsync();
        }
        public async Task<List<ProductSuggestionDTO>> GetBestSellingProductsByMonthAsync(int month, int year)
        {
            return await _context.OrderDetails
                .Where(od => od.Order.StatusNavigation.Name == _config.OrderStatus.Delivered && od.Order.CreateAt.HasValue &&
                             od.Order.CreateAt.Value.Month == month && od.Order.CreateAt.Value.Year == year)
                .GroupBy(od => new { od.ProductId, od.Product.Name, od.Product.ThumbnailUrl })
                .Select(g => new ProductSuggestionDTO
                {
                    ProductId = g.Key.ProductId ?? 0,
                    ProductName = g.Key.Name,
                    ThumbnailUrl = g.Key.ThumbnailUrl,
                    TotalSold = g.Sum(x => x.Quantity ?? 0)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(_config.SuggestionThreshold.TopCount)
                .ToListAsync();
        }

        public async Task<List<ProductSuggestionDTO>> GetBestSellingProductsByYearAsync(int year)
        {
            return await _context.OrderDetails
                .Where(od => od.Order.StatusNavigation.Name == _config.OrderStatus.Delivered
                && od.Order.CreateAt.HasValue && od.Order.CreateAt.Value.Year == year)
                .GroupBy(od => new { od.ProductId, od.Product.Name, od.Product.ThumbnailUrl })
                .Select(g => new ProductSuggestionDTO
                {
                    ProductId = g.Key.ProductId ?? 0,
                    ProductName = g.Key.Name,
                    ThumbnailUrl = g.Key.ThumbnailUrl,
                    TotalSold = g.Sum(x => x.Quantity ?? 0)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(_config.SuggestionThreshold.TopCount)
                .ToListAsync();
        }

        public async Task<List<ProductSuggestionDTO>> GetImportRecommendationAsync()
        {
            var now = DateTime.Now;
            var targetStartDate = now.AddYears(_config.SuggestionTimeRange.YearsBack).AddMonths(_config.SuggestionTimeRange.MonthsBefore);
            var targetEndDate = now.AddYears(_config.SuggestionTimeRange.YearsBack).AddMonths(_config.SuggestionTimeRange.MonthsAfter);

            return await _context.OrderDetails
                .Where(od => od.Order.StatusNavigation.Name == _config.OrderStatus.Delivered
                    && od.Order.CreateAt.HasValue
                    && od.Order.CreateAt.Value >= targetStartDate
                    && od.Order.CreateAt.Value <= targetEndDate)
                .GroupBy(od => new { od.ProductId, od.Product.Name, od.Product.ThumbnailUrl })
                .Select(g => new ProductSuggestionDTO
                {
                    ProductId = g.Key.ProductId ?? 0,
                    ProductName = g.Key.Name,
                    ThumbnailUrl = g.Key.ThumbnailUrl,
                    TotalSold = g.Sum(x => x.Quantity ?? 0)
                })
                .Where(x => x.TotalSold > _config.SuggestionThreshold.Import)
                .ToListAsync();
        }


        public async Task<List<ProductSuggestionDTO>> GetLimitRecommendationAsync()
        {
            var now = DateTime.Now;
            var targetStartDate = now.AddYears(-1).AddMonths(-2);
            var targetEndDate = now.AddYears(-1).AddMonths(2);

            return await _context.OrderDetails
                .Where(od => od.Order.StatusNavigation.Name == _config.OrderStatus.Delivered
                    && od.Order.CreateAt.HasValue
                    && od.Order.CreateAt.Value >= targetStartDate
                    && od.Order.CreateAt.Value <= targetEndDate)
                .GroupBy(od => new { od.ProductId, od.Product.Name, od.Product.ThumbnailUrl })
                .Select(g => new ProductSuggestionDTO
                {
                    ProductId = g.Key.ProductId ?? 0,
                    ProductName = g.Key.Name,
                    ThumbnailUrl = g.Key.ThumbnailUrl,
                    TotalSold = g.Sum(x => x.Quantity ?? 0)
                })
                .Where(x => x.TotalSold < _config.SuggestionThreshold.Limit)
                .ToListAsync();
        }

    }
}
