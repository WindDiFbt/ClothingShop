using ClothingShop_BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ClothingShopPrn232G5Context _context;

        public CategoriesController(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
