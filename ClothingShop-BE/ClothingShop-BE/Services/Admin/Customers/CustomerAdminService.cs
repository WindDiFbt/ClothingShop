using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Customers;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Services.Admin.Customers
{
    public class CustomerAdminService : ICustomerAdminService
    {
        private readonly ClothingShopPrn232G5Context _context;

        public CustomerAdminService(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<CustomerListResultDTO> GetAllCustomersAsync(string? searchTerm, string? statusFilter, int page, int pageSize)
        {
            var query = _context.Users
                .Include(u => u.Userinfo)
                    .ThenInclude(ui => ui.GenderNavigation)
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3))
                .AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u =>
                    u.UserName.Contains(searchTerm) ||
                    u.Email.Contains(searchTerm) ||
                    (u.Userinfo != null && u.Userinfo.FullName != null && u.Userinfo.FullName.Contains(searchTerm)) ||
                    (u.Userinfo != null && u.Userinfo.PhoneNumber != null && u.Userinfo.PhoneNumber.Contains(searchTerm))
                );
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(statusFilter) && int.TryParse(statusFilter, out int status))
            {
                query = query.Where(u => u.Status == status);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var customers = users.Select(u => new CustomerAdminDTO
            {
                Id = u.Id,
                UserName = u.UserName ?? "",
                Email = u.Email ?? "",
                FullName = u.Userinfo?.FullName,
                PhoneNumber = u.Userinfo?.PhoneNumber,
                Address = u.Userinfo?.Address,
                DateOfBirth = u.Userinfo?.DateOfBirth,
                Gender = u.Userinfo?.GenderNavigation?.Name ?? "Chưa cập nhật",
                Status = u.Status ?? 0,
                CreatedAt = u.CreatedAt
            }).ToList();

            return new CustomerListResultDTO
            {
                Customers = customers,
                TotalCount = totalCount,
                CurrentPage = page,
                TotalPages = totalPages,
                PageSize = pageSize
            };
        }

        public async Task<CustomerDetailDTO?> GetCustomerDetailAsync(Guid customerId)
        {
            var customer = await _context.Users
                .Include(u => u.Userinfo)
                    .ThenInclude(ui => ui.GenderNavigation)
                .Include(u => u.UserRoles)
                .Include(u => u.Orders)
                    .ThenInclude(o => o.StatusNavigation)
                .Where(u => u.Id == customerId && u.UserRoles.Any(ur => ur.RoleId == 3))
                .FirstOrDefaultAsync();

            if (customer == null) return null;

            var totalOrders = customer.Orders.Count;
            var totalSpent = customer.Orders.Where(o => o.Status == 4).Sum(o => o.TotalAmount); // Completed orders
            var averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

            return new CustomerDetailDTO
            {
                Id = customer.Id,
                UserName = customer.UserName ?? "",
                Email = customer.Email ?? "",
                FullName = customer.Userinfo?.FullName,
                PhoneNumber = customer.Userinfo?.PhoneNumber,
                Address = customer.Userinfo?.Address,
                DateOfBirth = customer.Userinfo?.DateOfBirth,
                Gender = customer.Userinfo?.GenderNavigation?.Name ?? "Chưa cập nhật",
                Status = customer.Status ?? 0,
                CreatedAt = customer.CreatedAt,
                TotalOrders = totalOrders,
                TotalSpent = totalSpent ?? 0,
                AverageOrderValue = averageOrderValue ?? 0,
                LastOrderDate = customer.Orders.OrderByDescending(o => o.CreateAt).FirstOrDefault()?.CreateAt
            };
        }

        public async Task<bool> UpdateCustomerStatusAsync(Guid customerId, int newStatus)
        {
            try
            {
                var customer = await _context.Users
                    .Include(u => u.UserRoles)
                    .Where(u => u.Id == customerId && u.UserRoles.Any(ur => ur.RoleId == 3))
                    .FirstOrDefaultAsync();

                if (customer == null) 
                {
                    Console.WriteLine($"Customer not found: {customerId}");
                    return false;
                }

                Console.WriteLine($"Updating customer {customerId} status from {customer.Status} to {newStatus}");
                
                customer.Status = newStatus;
                
                var changes = await _context.SaveChangesAsync();
                Console.WriteLine($"SaveChanges result: {changes} rows affected");
                
                return changes > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating customer status: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw; // Re-throw để controller có thể catch và trả về lỗi đúng
            }
        }

        public async Task<List<CustomerOrderDTO>> GetCustomerOrdersAsync(Guid customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.StatusNavigation)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreateAt)
                .ToListAsync();

            return orders.Select(o => new CustomerOrderDTO
            {
                Id = o.Id,
                TotalAmount = o.TotalAmount ?? 0,
                Status = o.Status ?? 0,
                StatusName = o.StatusNavigation?.Name ?? "",
                CreateAt = o.CreateAt ?? DateTime.MinValue,
                ItemCount = o.OrderDetails.Count,
                ProductNames = o.OrderDetails.Select(od => od.Product?.Name ?? "").Where(name => !string.IsNullOrEmpty(name)).ToList()
            }).ToList();
        }

        public async Task<CustomerStatisticsDTO> GetCustomerStatisticsAsync()
        {
            var totalCustomers = await _context.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3))
                .CountAsync();

            var activeCustomers = await _context.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3) && u.Status == 1)
                .CountAsync();

            var inactiveCustomers = await _context.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3) && u.Status == 2)
                .CountAsync();

            var bannedCustomers = await _context.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3) && u.Status == 3)
                .CountAsync();

            var newCustomersThisMonth = await _context.Users
                .Include(u => u.UserRoles)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3) &&
                           u.CreatedAt.HasValue &&
                           u.CreatedAt.Value.Year == DateTime.Now.Year &&
                           u.CreatedAt.Value.Month == DateTime.Now.Month)
                .CountAsync();

            var customersWithOrders = await _context.Users
                .Include(u => u.UserRoles)
                .Include(u => u.Orders)
                .Where(u => u.UserRoles.Any(ur => ur.RoleId == 3) && u.Orders.Any())
                .CountAsync();

            return new CustomerStatisticsDTO
            {
                TotalCustomers = totalCustomers,
                ActiveCustomers = activeCustomers,
                InactiveCustomers = inactiveCustomers,
                BannedCustomers = bannedCustomers,
                NewCustomersThisMonth = newCustomersThisMonth,
                CustomersWithOrders = customersWithOrders,
                ConversionRate = totalCustomers > 0 ? (double)customersWithOrders / totalCustomers * 100 : 0
            };
        }
    }
}
