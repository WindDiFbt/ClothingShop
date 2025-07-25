using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class CartRepository : ICartRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public CartRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<Cart> GetCartByUserIdAsync(Guid userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                    .ThenInclude(cd => cd.Product)
                        .ThenInclude(p => p.Category)
                .Include(c => c.CartDetails)
                    .ThenInclude(cd => cd.Product)
                        .ThenInclude(p => p.Images)
                .Include(c => c.CartDetails)
                    .ThenInclude(cd => cd.Product)
                        .ThenInclude(p => p.ProductVariants)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            return cart ?? new Cart { UserId = userId, TotalAmount = 0 };
        }

        public async Task<CartDetail> AddOrUpdateItemAsync(Guid userId, long productId, int quantity)
        {
            // Get or create cart
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                bool userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                cart = new Cart
                {
                    Id = Guid.NewGuid(),
                    UserId = userExists ? userId : null,
                    TotalAmount = 0,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow
                };
                _context.Carts.Add(cart);
            }

            var cartDetail = cart.CartDetails.FirstOrDefault(cd => cd.ProductId == productId);
            if (cartDetail == null)
            {
                cartDetail = new CartDetail
                {
                    CartId = cart.Id,
                    ProductId = productId,
                    Quantity = quantity,
                    TotalPrice = 0,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow
                };
                cart.CartDetails.Add(cartDetail);
                _context.CartDetails.Add(cartDetail);
            }
            else
            {
                cartDetail.Quantity = quantity;
                cartDetail.UpdateAt = DateTime.UtcNow;
                _context.CartDetails.Update(cartDetail);
            }

            // Optionally recalculate total amount
            await _context.SaveChangesAsync();
            return cartDetail;
        }

        public async Task RemoveItemAsync(Guid userId, long productId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null) return;

            var detail = cart.CartDetails.FirstOrDefault(cd => cd.ProductId == productId);
            if (detail != null)
            {
                _context.CartDetails.Remove(detail);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ClearCartAsync(Guid userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart == null) return;

            _context.CartDetails.RemoveRange(cart.CartDetails);
            await _context.SaveChangesAsync();
        }
    }
}