using ClothingShop_BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ClothingShopPrn232G5Context _context;

        public HomeController(ILogger<HomeController> logger, ClothingShopPrn232G5Context context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<homeModel>> Index()
        {
            int totalProducts = await _context.Products.CountAsync();
            List<Product> hotproducts = await _context.Products
                .Where(p => p.Discount == 0)
                .Take(10)
                .ToListAsync();
            List<Product> saleProducts = await _context.Products
                .Where(p => p.Discount > 0)
                .OrderByDescending(p => p.Discount)
                .Take(5)
                .ToListAsync();
            var homeModel = new homeModel
            {
                hotProducts = hotproducts,
                saleProducts = saleProducts
            };
            return Ok(homeModel);
        }
    }

    public class homeModel
    {
        public List<Product> hotProducts { get; set; } = new List<Product>();
        public List<Product> saleProducts { get; set; } = new List<Product>();
    }

}
