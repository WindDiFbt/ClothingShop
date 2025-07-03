using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct;
using ClothingShop_BE.Services.Admin.Products;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductAdminService _productService;

        public ProductsController(IProductAdminService productService)
        {
            _productService = productService;
        }

        // GET: api/products/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<PendingProductDTO>>> GetPendingProducts()
        {
            try
            {
                var pendingProducts = await _productService.GetPendingProductsAsync();
                return Ok(pendingProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving pending products",
                    error = ex.Message
                });
            }
        }

        // PUT: api/products/{id}/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveProduct(long id)
        {
            try
            {
                var result = await _productService.ApproveProductAsync(id);

                if (!result)
                {
                    return NotFound(new { message = "Product not found or not in pending status" });
                }

                return Ok(new { message = "Product approved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // PUT: api/products/{id}/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectProduct(long id, RejectProductDTO rejectDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(rejectDto.RejectReason))
                {
                    return BadRequest(new { message = "Rejection reason is required" });
                }

                var result = await _productService.RejectProductAsync(id, rejectDto.RejectReason);

                if (!result)
                {
                    return NotFound(new { message = "Product not found or not in pending status" });
                }

                return Ok(new { message = "Product rejected successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/products/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<PendingProductDTO>>> GetAllProducts()
        {
            try
            {
                var allProducts = await _productService.GetAllProductsAsync();
                return Ok(allProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving all products",
                    error = ex.Message
                });
            }
        }
    }
}
