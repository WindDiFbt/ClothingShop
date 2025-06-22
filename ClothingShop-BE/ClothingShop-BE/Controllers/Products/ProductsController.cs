using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace ClothingShop_BE.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ODataController
    {
        private readonly IProductService _productService;
        private readonly ClothingShopPrn232G5Context _context;

        public ProductsController(ClothingShopPrn232G5Context context, IProductService productService)
        {
            _context = context;
            _productService = productService;
        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<Product> Get()
        {
            return _context.Products.Where(p => p.Status == 1);
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetProductsPagination(int page = 1, int pageSize = 8)
        {
            var (products, currentPage, totalPages) = await _productService.GetProductsAsync(page, pageSize);
            return Ok(new { products, currentPage, totalPages });
        }

        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetProduct(long id)
        {
            var (productDto, seller, relatedProducts, feedbacks) = await _productService.GetDetailProductsAsync(id);
            return Ok(new { productDto, seller, relatedProducts, feedbacks });
        }

        [HttpGet("categories")]
        public async Task<ActionResult<List<CategoryDTO>>> GetCategories()
        {
            var categories = await _productService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("status")]
        public async Task<ActionResult<List<ProductStatusDTO>>> GetProductStatuses()
        {
            var statuses = await _productService.GetProductStatusesAsync();
            return Ok(statuses);
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

        [HttpGet("admin-only")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới access được
        public IActionResult GetAdminData()
        {
            return Ok(new { message = "This is admin-only data" });
        }

        [HttpGet("public")]
        [AllowAnonymous] // Không cần JWT token
        public IActionResult GetPublicData()
        {
            return Ok(new { message = "This is public data" });
        }

    }
}
