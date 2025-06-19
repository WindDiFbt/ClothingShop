using ClothingShop_BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace ClothingShop_BE.Controllers.Products
{
    [Route("api")]
    public class ProductsOdataController : ODataController
    {
        public readonly ClothingShopPrn232G5Context _context;
        public ProductsOdataController(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        [EnableQuery]
        [HttpGet("odata/Products")]
        public IQueryable<Product> GetProductsODATA()
        {
            return _context.Products.Where(p=>p.Status == 1);
        }
    }
}
