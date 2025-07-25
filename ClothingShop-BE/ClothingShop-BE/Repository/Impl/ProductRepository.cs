using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class ProductRepository : IProductRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public ProductRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
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
    }
}
