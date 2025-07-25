using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ODataController
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [Authorize(Roles = "ADMIN,SELLER")]
        [EnableQuery]
        [HttpGet]
        public IActionResult Get()
        {
            var query = _orderService.GetAllOrdersOData();
            return Ok(query);
        }
    }
}
