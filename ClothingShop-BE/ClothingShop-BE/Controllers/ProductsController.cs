using Microsoft.AspNetCore.Mvc;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using Microsoft.AspNetCore.Authorization;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ODataController
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [EnableQuery]
        [HttpGet]
        public IQueryable<Product> Get()
        {
            return _productService.GetAllProductsODATA();
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
        [Authorize(Roles = "ADMIN,SELLER")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.CreateProductAsync(dto);
            return Ok(product);
        }

        [Authorize(Roles = "ADMIN,SELLER")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(long id, [FromBody] ProductDTO dto)
        {
            var updated = await _productService.UpdateProductAsync(id, dto);
            return Ok(updated);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpGet("stock-status")]
        public async Task<IActionResult> GetStockStatus()
        {
            var result = await _productService.GetProductStockStatusAsync();
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpGet("best-selling-month")]
        public async Task<IActionResult> GetBestSellingByMonth(int month, int year)
        {
            var result = await _productService.GetBestSellingByMonth(month, year);
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpGet("best-selling-year")]
        public async Task<IActionResult> GetBestSellingByYear(int year)
        {
            var result = await _productService.GetBestSellingByYear(year);
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpGet("import-recommendation")]
        public async Task<IActionResult> GetImportRecommendation()
        {
            var result = await _productService.GetImportRecommendation();
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpGet("limit-recommendation")]
        public async Task<IActionResult> GetLimitRecommendation()
        {
            var result = await _productService.GetLimitRecommendation();
            return Ok(result);
        }
        [Authorize(Roles = "ADMIN_BUSINESS")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateProductStatus(long id, [FromQuery] int newStatusId)
        {
            await _productService.UpdateProductStatusAsync(id, newStatusId);
            return NoContent();
        }
    }
}
