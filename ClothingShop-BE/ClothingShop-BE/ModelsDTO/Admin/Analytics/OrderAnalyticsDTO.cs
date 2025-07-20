namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class OrderAnalyticsDTO
    {
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal OrderGrowth { get; set; }
        public List<OrderStatusData> StatusDistribution { get; set; } = new List<OrderStatusData>();
        public List<DailyOrders> DailyData { get; set; } = new List<DailyOrders>();
    }

    public class OrderStatusData
    {
        public string StatusName { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class DailyOrders
    {
        public DateTime Date { get; set; }
        public int OrderCount { get; set; }
        public decimal TotalRevenue { get; set; }
    }
} 