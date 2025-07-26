namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class SellerAnalyticsDTO
    {
        // Basic Seller Statistics
        public int TotalActiveSellers { get; set; }
        public int NewSellersThisMonth { get; set; }
        public int NewSellersThisYear { get; set; }
        public double SellerGrowthRate { get; set; }
        
        // Top Sellers by Revenue
        public List<TopSellerDTO> TopSellersByRevenue { get; set; } = new List<TopSellerDTO>();
        
        // Revenue Distribution
        public List<SellerRevenueDTO> SellerRevenueDistribution { get; set; } = new List<SellerRevenueDTO>();
        
        // Top Products by Seller
        public List<SellerTopProductsDTO> SellerTopProducts { get; set; } = new List<SellerTopProductsDTO>();
        
        // Order Completion Rates
        public List<SellerOrderStatsDTO> SellerOrderStats { get; set; } = new List<SellerOrderStatsDTO>();
        
        // Date Range
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class TopSellerDTO
    {
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public string Email { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalProducts { get; set; }
        public double CompletionRate { get; set; }
        public DateTime? LastActiveDate { get; set; }
    }

    public class SellerRevenueDTO
    {
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public decimal Revenue { get; set; }
        public double Percentage { get; set; }
        public int OrderCount { get; set; }
        public int ProductCount { get; set; }
    }

    public class SellerTopProductsDTO
    {
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public List<ProductSalesDTO> TopProducts { get; set; } = new List<ProductSalesDTO>();
    }

    public class ProductSalesDTO
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public string CategoryName { get; set; }
    }

    public class SellerOrderStatsDTO
    {
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CancelledOrders { get; set; }
        public double CompletionRate { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
    }
} 