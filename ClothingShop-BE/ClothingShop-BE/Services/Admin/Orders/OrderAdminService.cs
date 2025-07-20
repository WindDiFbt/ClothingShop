using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Services.Admin.Orders
{
    public class OrderAdminService : IOrderAdminService
    {
        private readonly ClothingShopPrn232G5Context _context;

        public OrderAdminService(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<OrderListResultDTO> GetAllOrdersAsync(string? searchTerm, string? statusFilter, int page, int pageSize)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .ThenInclude(c => c.Userinfo)
                .Include(o => o.StatusNavigation)
                .Include(o => o.OrderDetails)
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(o =>
                    o.FullName!.Contains(searchTerm) ||
                    o.PhoneNumber!.Contains(searchTerm) ||
                    o.Id.ToString().Contains(searchTerm)
                );
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(statusFilter) && int.TryParse(statusFilter, out int status))
            {
                query = query.Where(o => o.Status == status);
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderAdminDTO
                {
                    Id = o.Id,
                    CustomerName = o.Customer != null ? 
                        (o.Customer.Userinfo != null ? o.Customer.Userinfo.FullName : o.Customer.UserName) : 
                        o.FullName,
                    PhoneNumber = o.PhoneNumber,
                    Address = o.Address,
                    Note = o.Note,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    StatusName = o.StatusNavigation != null ? o.StatusNavigation.Name : "Unknown",
                    TotalAmount = o.TotalAmount,
                    CreateAt = o.CreateAt,
                    UpdateAt = o.UpdateAt,
                    ItemCount = o.OrderDetails.Count
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return new OrderListResultDTO
            {
                Orders = orders,
                TotalCount = totalCount,
                CurrentPage = page,
                TotalPages = totalPages,
                PageSize = pageSize
            };
        }

        public async Task<OrderDetailAdminDTO?> GetOrderDetailAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .ThenInclude(c => c.Userinfo)
                .Include(o => o.StatusNavigation)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .ThenInclude(p => p.Images)
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.StatusNavigation)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                return null;

            var orderItems = order.OrderDetails.Select(od => new OrderItemAdminDTO
            {
                Id = od.Id,
                ProductId = od.ProductId,
                ProductName = od.Product?.Name,
                ProductImage = od.Product?.Images?.FirstOrDefault()?.Url,
                Quantity = od.Quantity,
                UnitPrice = od.UnitPrice,
                Discount = od.Discount,
                TotalPrice = od.TotalPrice,
                Status = od.Status,
                StatusName = od.StatusNavigation?.Name
            }).ToList();

            return new OrderDetailAdminDTO
            {
                Id = order.Id,
                CustomerName = order.Customer != null ? 
                    (order.Customer.Userinfo != null ? order.Customer.Userinfo.FullName : order.Customer.UserName) : 
                    order.FullName,
                PhoneNumber = order.PhoneNumber,
                Address = order.Address,
                Note = order.Note,
                OrderDate = order.OrderDate,
                Status = order.Status,
                StatusName = order.StatusNavigation?.Name,
                TotalAmount = order.TotalAmount,
                CreateAt = order.CreateAt,
                UpdateAt = order.UpdateAt,
                OrderItems = orderItems
            };
        }

        public async Task<bool> UpdateOrderStatusAsync(Guid orderId, int newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return false;

            order.Status = newStatus;
            order.UpdateAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<OrderStatisticsDTO> GetOrderStatisticsAsync()
        {
            var orders = await _context.Orders.ToListAsync();

            var statistics = new OrderStatisticsDTO
            {
                TotalOrders = orders.Count,
                PendingOrders = orders.Count(o => o.Status == 1),
                ProcessingOrders = orders.Count(o => o.Status == 2),
                ShippedOrders = orders.Count(o => o.Status == 3),
                CompletedOrders = orders.Count(o => o.Status == 4),
                CancelledOrders = orders.Count(o => o.Status == 5),
                TotalRevenue = orders.Where(o => o.Status == 4).Sum(o => o.TotalAmount ?? 0),
                AverageOrderValue = orders.Where(o => o.Status == 4).Any() ? 
                    orders.Where(o => o.Status == 4).Average(o => o.TotalAmount ?? 0) : 0
            };

            return statistics;
        }
    }
} 