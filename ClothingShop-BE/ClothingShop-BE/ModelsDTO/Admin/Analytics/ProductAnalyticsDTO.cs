namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class ProductAnalyticsDTO
    {
        public int TotalProducts { get; set; }
        public int PendingProducts { get; set; }
        public int ApprovedProducts { get; set; }
        public int RejectedProducts { get; set; }
        public List<TopProduct> TopProducts { get; set; } = new List<TopProduct>();
        public List<CategoryProductCount> CategoryDistribution { get; set; } = new List<CategoryProductCount>();
    }

    public class TopProduct
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public int SalesCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageRating { get; set; }
    }

    public class CategoryProductCount
    {
        public string CategoryName { get; set; }
        public int ProductCount { get; set; }
        public decimal Percentage { get; set; }
    }
} 