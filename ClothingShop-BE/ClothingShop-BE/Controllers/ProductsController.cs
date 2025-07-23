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


    }
}
