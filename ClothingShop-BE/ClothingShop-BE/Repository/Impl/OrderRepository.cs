using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public OrderRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<Order> GetOrderAsync(Guid orderId) =>
            await _context.Orders
                .Where(o => o.Id == orderId)
                .FirstOrDefaultAsync();

        public async Task<bool> HasOrderExistAsync(Guid orderId) =>
            await _context.Orders.AnyAsync(o => o.Id == orderId);

        public async Task<bool> HasUserOrderedAsync(Guid userId, Guid ordeId) =>
            await _context.Orders.AnyAsync(o => o.Id == ordeId && o.CustomerId == userId);
    }
}
