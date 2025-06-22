using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Mvc;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IProductService _productService;

        public HomeController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var (hotProducts, saleProducts) = await _productService.GetProductsHomePageAsync();
            return Ok(new { hotProducts, saleProducts });
        }
    }
}
