using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClothingShop_BE.Models;
using Microsoft.Extensions.Caching.Memory;
using ClothingShop_BE.ModelsDTO;
using NuGet.Protocol.Plugins;

namespace ClothingShop_BE.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ClothingShopPrn232G5Context _context;
        private readonly IMemoryCache _cache;

        public ProductsController(ClothingShopPrn232G5Context context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            return await _context.Products.Select(x => new ProductDTO(x)).ToListAsync();
        }

        // GET: api/Products/detail/5
        [HttpGet("detail/{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(long id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Category)
                .Include(p => p.ProductVariants)
                .Include(p => p.Seller)
                    .ThenInclude(p => p.Userinfo)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            var productDto = new ProductDTO(product);
            var relatedProducts = await _context.Products
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
                .Select(x => new ProductDTO(x))
                .Take(5)
                .ToListAsync();
            var feedbacks = await _context.Feedbacks
                .Where(f => f.ProductId == id)
                .Include(f => f.User)
                .ThenInclude(f => f.Userinfo)
                .OrderByDescending(f => f.CreateAt)
                .Take(3)
                .Select(x => new FeedbackDTO(x))
                .ToListAsync();
            var seller = new
            {
                Id = product.Seller.Id,
                AvatarUrl = product.Seller.Userinfo.AvatarUrl,
                Username = product.Seller.UserName,
                FullName = product.Seller.Userinfo.FullName
            };
            return Ok(new { productDto, seller, relatedProducts, feedbacks });
        }

        private bool ProductExists(long id)
        {
            return _context.Products.Any(e => e.Id == id);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            if (!_cache.TryGetValue("categories", out List<CategoryDTO>? categories))
            {
                categories = await _context.Categories.Select(x => new CategoryDTO(x)).ToListAsync();
                _cache.Set("categories", categories, TimeSpan.FromMinutes(10));
            }
            return Ok(categories!);
        }

        [HttpGet("status")]
        public async Task<ActionResult<IEnumerable<ProductStatusDTO>>> GetProductStatuses()
        {
            if (!_cache.TryGetValue("statuses", out List<ProductStatusDTO>? statuses))
            {
                statuses = await _context.ProductStatuses.Select(x => new ProductStatusDTO(x)).ToListAsync();
                _cache.Set("statuses", statuses, TimeSpan.FromMinutes(10));
            }
            return Ok(statuses!);
        }

        [HttpGet("search")]
        public async Task<ActionResult> Search(string query, int page = 1, int pageSize = 8)
        {
            try
            {
                var queryable = _context.Products
                    .AsNoTracking()
                    .Where(p => p.Status == 1 &&
                                (p.Name.ToLower().Contains(query.ToLower()) ||
                                 p.Description.ToLower().Contains(query.ToLower())));
                int totalProducts = await queryable.CountAsync();
                List<ProductDTO> products = await queryable
                    .OrderBy(p => p.Id)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(x => new ProductDTO(x))
                    .ToListAsync();
                var currentPage = page;
                var totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);
                var searchQuery = query;
                return Ok(new { products, currentPage, totalPages, searchQuery });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
    }
}
