namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class DashboardOverviewDTO
    {
        // Financial Metrics
        public decimal? TotalRevenue { get; set; }
        public decimal? TotalExpenses { get; set; }
        public decimal? TotalProfit { get; set; }
        public decimal? RevenueGrowth { get; set; }
        public decimal? ProfitGrowth { get; set; }

        // Order Metrics
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal? AverageOrderValue { get; set; }
        public double? OrderGrowth { get; set; }

        // Customer Metrics
        public int TotalCustomers { get; set; }
        public int NewCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public double? CustomerGrowth { get; set; }

        // Product Metrics
        public int TotalProducts { get; set; }
        public int PendingProducts { get; set; }
        public int ApprovedProducts { get; set; }
        public int RejectedProducts { get; set; }

        // Report Metrics
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int ResolvedReports { get; set; }

        // Recent Activity
        public List<RecentOrderDTO> RecentOrders { get; set; } = new List<RecentOrderDTO>();
        public List<RecentCustomerDTO> RecentCustomers { get; set; } = new List<RecentCustomerDTO>();
        public List<PendingItemDTO> PendingItems { get; set; } = new List<PendingItemDTO>();

        // Date Range
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class RecentOrderDTO
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string StatusName { get; set; }
        public DateTime OrderDate { get; set; }
    }

    public class RecentCustomerDTO
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class PendingItemDTO
    {
        public string Type { get; set; } // "product" or "report"
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
    }
} 