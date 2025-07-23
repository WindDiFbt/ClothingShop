using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Services.Admin.Analytics
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ClothingShopPrn232G5Context _context;

        public AnalyticsService(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        [Authorize]
        public async Task<DashboardOverviewDTO> GetDashboardOverviewAsync(DateTime? startDate, DateTime? endDate)
        {
            // Set default date range if not provided
            if (!startDate.HasValue)
                startDate = DateTime.Now.AddDays(-30);
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            // Previous period for growth calculation
            var previousStartDate = startDate.Value.AddDays(-(endDate.Value - startDate.Value).Days);
            var previousEndDate = startDate.Value;

            var result = new DashboardOverviewDTO
            {
                StartDate = startDate,
                EndDate = endDate
            };

            // Financial Metrics
            var currentPeriodOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == 4) // Completed orders
                .ToListAsync();

            var previousPeriodOrders = await _context.Orders
                .Where(o => o.OrderDate >= previousStartDate && o.OrderDate <= previousEndDate && o.Status == 4)
                .ToListAsync();

            result.TotalRevenue = currentPeriodOrders.Sum(o => o.TotalAmount ?? 0);
            result.TotalExpenses = currentPeriodOrders.Sum(o => o.TotalAmount * 0.3m); // Assuming 30% cost
            result.TotalProfit = result.TotalRevenue - result.TotalExpenses;

            var previousRevenue = previousPeriodOrders.Sum(o => o.TotalAmount ?? 0);
            result.RevenueGrowth = previousRevenue > 0 ? ((result.TotalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

            var previousProfit = previousRevenue * 0.7m;
            result.ProfitGrowth = previousProfit > 0 ? ((result.TotalProfit - previousProfit) / previousProfit) * 100 : 0;

            // Order Metrics
            result.TotalOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .CountAsync();

            result.CompletedOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == 4)
                .CountAsync();

            result.PendingOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == 1)
                .CountAsync();

            result.CancelledOrders = await _context.Orders
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == 5)
                .CountAsync();

            result.AverageOrderValue = result.TotalOrders > 0 ? result.TotalRevenue / result.TotalOrders : 0;

            var previousTotalOrders = await _context.Orders
                .Where(o => o.OrderDate >= previousStartDate && o.OrderDate <= previousEndDate)
                .CountAsync();

            result.OrderGrowth =  previousTotalOrders > 0 ? ((result.TotalOrders - previousTotalOrders) / (double)previousTotalOrders) * 100 : 0;

            // Customer Metrics
            result.TotalCustomers = await _context.Users
                .Where(u => u.CreatedAt <= endDate)
                .CountAsync();

            result.NewCustomers = await _context.Users
                .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
                .CountAsync();

            result.ActiveCustomers = await _context.Users
                .Where(u => u.Orders.Any(o => o.OrderDate >= startDate && o.OrderDate <= endDate))
                .CountAsync();

            var previousTotalCustomers = await _context.Users
                .Where(u => u.CreatedAt <= previousEndDate)
                .CountAsync();

            result.CustomerGrowth = previousTotalCustomers > 0 ? ((result.TotalCustomers - previousTotalCustomers) / (double)previousTotalCustomers) * 100 : 0;

            // Product Metrics
            result.TotalProducts = await _context.Products.CountAsync();
            result.PendingProducts = await _context.Products.Where(p => p.Status == 2).CountAsync();
            result.ApprovedProducts = await _context.Products.Where(p => p.Status == 1).CountAsync();
            result.RejectedProducts = await _context.Products.Where(p => p.Status == 3).CountAsync();

            // Report Metrics
            result.TotalReports = await _context.Reports.CountAsync();
            result.PendingReports = await _context.Reports.Where(r => r.Status == 1).CountAsync();
            result.ResolvedReports = await _context.Reports.Where(r => r.Status == 3).CountAsync();

            // Recent Orders
            result.RecentOrders = await _context.Orders
                .Include(o => o.Customer)
                .ThenInclude(c => c.Userinfo)
                .Include(o => o.StatusNavigation)
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate)
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .Select(o => new RecentOrderDTO
                {
                    Id = o.Id,
                    CustomerName = o.Customer.Userinfo != null ? o.Customer.Userinfo.FullName : o.Customer.UserName,
                    TotalAmount = o.TotalAmount ?? 0,
                    Status = o.Status.ToString(),
                    StatusName = o.StatusNavigation.Name,
                    OrderDate = o.OrderDate ?? DateTime.Now
                })
                .ToListAsync();

            // Recent Customers
            result.RecentCustomers = await _context.Users
                .Include(u => u.Userinfo)
                .Include(u => u.Orders)
                .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
                .OrderByDescending(u => u.CreatedAt)
                .Take(10)
                .Select(u => new RecentCustomerDTO
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    FullName = u.Userinfo != null ? u.Userinfo.FullName : u.UserName,
                    Email = u.Email,
                    RegistrationDate = u.CreatedAt ?? DateTime.Now,
                    TotalOrders = u.Orders.Count(),
                    TotalSpent = u.Orders.Where(o => o.Status == 4).Sum(o => o.TotalAmount ?? 0)
                })
                .ToListAsync();

            // Pending Items
            var pendingProducts = await _context.Products
                .Where(p => p.Status == 2)
                .OrderByDescending(p => p.CreateAt)
                .Take(5)
                .Select(p => new PendingItemDTO
                {
                    Type = "product",
                    Id = p.Id,
                    Name = p.Name,
                    Description = $"Sản phẩm chờ duyệt: {p.Name}",
                    CreatedDate = p.CreateAt ?? DateTime.Now
                })
                .ToListAsync();

            var pendingReports = await _context.Reports
                .Include(r => r.Product)
                .Where(r => r.Status == 1)
                .OrderByDescending(r => r.CreateAt)
                .Take(5)
                .Select(r => new PendingItemDTO
                {
                    Type = "report",
                    Id = r.Id,
                    Name = r.Product != null ? r.Product.Name : "Sản phẩm không xác định",
                    Description = r.Reason,
                    CreatedDate = r.CreateAt ?? DateTime.Now
                })
                .ToListAsync();

            result.PendingItems = pendingProducts.Concat(pendingReports)
                .OrderByDescending(p => p.CreatedDate)
                .Take(10)
                .ToList();

            return result;
        }

        public async Task<CategorySalesResponseDTO> GetCategorySalesAsync(DateTime? startDate, DateTime? endDate)
        {
            // Set default date range if not provided
            if (!startDate.HasValue)
                startDate = DateTime.Now.AddDays(-30);
            if (!endDate.HasValue)
                endDate = DateTime.Now;

            var result = new CategorySalesResponseDTO
            {
                StartDate = startDate,
                EndDate = endDate
            };

            // Get category sales data
            var categorySales = await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .ThenInclude(p => p.Category)
                .Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.Status == 4) // Completed orders only
                .SelectMany(o => o.OrderDetails)
                .GroupBy(od => new { od.Product.Category.Id, od.Product.Category.Name })
                .Select(g => new CategorySalesDTO
                {
                    CategoryId = g.Key.Id,
                    CategoryName = g.Key.Name,
                    Revenue = g.Sum(od => od.TotalPrice ?? 0),
                    OrderCount = g.Select(od => od.OrderId).Distinct().Count(),
                    ProductCount = g.Select(od => od.ProductId).Distinct().Count()
                })
                .OrderByDescending(c => c.Revenue)
                .ToListAsync();

            // Calculate total revenue and percentages
            var totalRevenue = categorySales.Sum(c => c.Revenue);
            result.TotalRevenue = totalRevenue;
            result.TotalOrders = categorySales.Sum(c => c.OrderCount);

            // Calculate percentage for each category
            foreach (var category in categorySales)
            {
                category.Percentage = totalRevenue > 0 ? (double)((category.Revenue / totalRevenue) * 100) : 0;
            }

            result.CategoryData = categorySales;

            return result;
        }
    }
} 