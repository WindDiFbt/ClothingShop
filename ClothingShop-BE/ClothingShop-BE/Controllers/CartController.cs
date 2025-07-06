using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Thêm authorization cho Cart
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet] // api/cart?userId={userId}
        public async Task<IActionResult> GetCart([FromQuery] Guid userId)
        {
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }

        [HttpPost("addOrUpdate")]
        public async Task<IActionResult> AddOrUpdateItem([FromBody] AddOrUpdateCartRequest request)
        {
            var cart = await _cartService.AddOrUpdateItemAsync(request.UserId, request.ProductId, request.Quantity);
            Console.WriteLine($"Cart after adding/updating item: {cart.UserId}");
            return Ok(cart);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveItem([FromBody] RemoveCartItemRequest request)
        {
            await _cartService.RemoveItemAsync(request.UserId, request.ProductId);
            return NoContent();
        }

        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(Guid userId)
        {
            await _cartService.ClearCartAsync(userId);
            return NoContent();
        }

        public record AddOrUpdateCartRequest(Guid UserId, long ProductId, int Quantity);
        public record RemoveCartItemRequest(Guid UserId, long ProductId);
    }
}