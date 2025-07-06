using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Repository;

namespace ClothingShop_BE.Service.Impl
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task<CartDTO> GetCartAsync(Guid userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            var cartDto = new CartDTO(cart);

            // Calculate prices for cart items
            CalculateCartPrices(cartDto);

            return cartDto;
        }

        public async Task<CartDTO> AddOrUpdateItemAsync(Guid userId, long productId, int quantity)
        {
            await _cartRepository.AddOrUpdateItemAsync(userId, productId, quantity);
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            var cartDto = new CartDTO(cart);

            // Calculate prices for cart items
            CalculateCartPrices(cartDto);

            return cartDto;
        }

        public async Task RemoveItemAsync(Guid userId, long productId)
        {
            await _cartRepository.RemoveItemAsync(userId, productId);
        }

        public async Task ClearCartAsync(Guid userId)
        {
            await _cartRepository.ClearCartAsync(userId);
        }

        private void CalculateCartPrices(CartDTO cartDto)
        {
            int totalAmount = 0;

            foreach (var item in cartDto.CartDetails)
            {
                if (item.Product != null && item.Quantity.HasValue)
                {
                    // Calculate current price with discount
                    var currentPrice = item.Product.CurrentPrice ?? item.Product.Price ?? 0;
                    var itemTotal = currentPrice * item.Quantity.Value;

                    item.TotalPrice = itemTotal;
                    totalAmount += itemTotal;
                }
            }

            cartDto.TotalAmount = totalAmount;
        }
    }
}