namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class RevenueAnalyticsDTO
    {
        public List<MonthlyRevenue> MonthlyData { get; set; } = new List<MonthlyRevenue>();
        public List<CategoryRevenue> CategoryData { get; set; } = new List<CategoryRevenue>();
        public decimal TotalRevenue { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal RevenueGrowth { get; set; }
        public decimal ProfitGrowth { get; set; }
    }

    public class MonthlyRevenue
    {
        public string Month { get; set; }
        public decimal Revenue { get; set; }
        public decimal Expenses { get; set; }
        public decimal Profit { get; set; }
    }

    public class CategoryRevenue
    {
        public string CategoryName { get; set; }
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
        public decimal Percentage { get; set; }
    }
} 