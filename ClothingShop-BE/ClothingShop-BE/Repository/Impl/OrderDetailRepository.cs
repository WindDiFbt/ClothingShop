using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public OrderDetailRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }
        public async Task<OrderDetail> GetOrderDetailAsync(Guid orderId) =>
            await _context.OrderDetails
                .Include(od => od.Product)
                .ThenInclude(p => p.Category)
                .FirstOrDefaultAsync(od => od.OrderId == orderId);

        public async Task<bool> HasOrderDetailExistAsync(Guid orderId, long productId) =>
            await _context.OrderDetails.AnyAsync(od => od.ProductId == productId && od.OrderId == orderId);
    }
}
