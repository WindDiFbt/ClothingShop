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
        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders.ToListAsync();
        }

        // Existing methods
        public async Task<Order?> GetOrderAsync(Guid orderId) =>
            await _context.Orders
                .Where(o => o.Id == orderId)
                .FirstOrDefaultAsync();

        public async Task<bool> HasOrderExistAsync(Guid orderId) =>
            await _context.Orders.AnyAsync(o => o.Id == orderId);

        public async Task<bool> HasUserOrderedAsync(Guid userId, Guid orderId) =>
            await _context.Orders.AnyAsync(o => o.Id == orderId && o.CustomerId == userId);

        // New methods for Sprint 2
        public async Task<Order> CreateOrderAsync(Order order)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return order;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<Order?> GetOrderByIdAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == orderId);



            if (order == null) return null;

            return order;
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(Guid userId)
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.CreateAt)
                .ToListAsync();



            // Explicitly load OrderDetails with Products for each order
            foreach (var order in orders)
            {
                await _context.Entry(order)
                    .Collection(o => o.OrderDetails)
                    .Query()
                    .Include(od => od.Product)
                        .ThenInclude(p => p!.Category)
                    .Include(od => od.Product)
                        .ThenInclude(p => p!.Images)
                    .Include(od => od.Product)
                        .ThenInclude(p => p!.ProductVariants)
                    .LoadAsync();
            }

            return orders;
        }

        public async Task<Order?> UpdateOrderStatusAsync(Guid orderId, int status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return null;

            order.Status = status;
            order.UpdateAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> CheckStockAvailabilityAsync(long productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return false;

            // Check if product variants have enough stock
            var totalStock = await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .SumAsync(pv => pv.Quantity ?? 0);

            return totalStock >= quantity;
        }

        public async Task<bool> ReduceProductStockAsync(long productId, int quantity)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Get product variants with available stock (FIFO approach)
                var variants = await _context.ProductVariants
                    .Where(pv => pv.ProductId == productId && pv.Quantity > 0)
                    .OrderBy(pv => pv.Id) // FIFO
                    .ToListAsync();

                int remainingQuantity = quantity;
                foreach (var variant in variants)
                {
                    if (remainingQuantity <= 0) break;

                    int reduceAmount = Math.Min(variant.Quantity ?? 0, remainingQuantity);
                    variant.Quantity -= reduceAmount;
                    remainingQuantity -= reduceAmount;
                }

                if (remainingQuantity > 0)
                {
                    await transaction.RollbackAsync();
                    return false; // Not enough stock
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> RestoreProductStockAsync(long productId, int quantity)
        {
            // For simplicity, add back to the first variant
            var variant = await _context.ProductVariants
                .Where(pv => pv.ProductId == productId)
                .FirstOrDefaultAsync();

            if (variant != null)
            {
                variant.Quantity = (variant.Quantity ?? 0) + quantity;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public IQueryable<Order> GetAllOrdersForODATA()
        {
            return _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product);
        }
        public async Task<(int totalItems, List<Order>)> GetOrdersPagedBySellerAsync( int page, int pageSize)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Include(o => o.StatusNavigation)
                .Include(o => o.Voucher)
                .AsQueryable();

            var totalItems = await query.CountAsync();

            var orders = await query
                .OrderByDescending(o => o.CreateAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (totalItems, orders);
        }

        public async Task<Order?> GetOrderDetailWithIncludesAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Where(o => o.Id == orderId)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync();

            // Nếu không có OrderDetails → gán rỗng để tránh null reference
            if (order != null && order.OrderDetails == null)
                order.OrderDetails = new List<OrderDetail>();

            return order;
        }



        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
        public IQueryable<Order> GetAllOrders()
    {
        return _context.Orders.Include(o => o.OrderDetails);
    }
    }
}
