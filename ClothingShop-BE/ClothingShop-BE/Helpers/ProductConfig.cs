namespace ClothingShop_BE.Helpers
{
    public class ProductConfig
    {
        public OrderStatusConfig OrderStatus { get; set; } = new();
        public SuggestionThresholdConfig SuggestionThreshold { get; set; } = new();
        public StockStatusConfig StockStatus { get; set; } = new();
        public SuggestionTimeRange SuggestionTimeRange { get; set; } = new();
    }

    public class OrderStatusConfig
    {
        public string Delivered { get; set; } = "DELIVERED";
    }

    public class SuggestionThresholdConfig
    {
        public int Import { get; set; }
        public int Limit { get; set; }
        public int TopCount { get; set; }
    }

    public class StockStatusConfig
    {
        public int LowThreshold { get; set; }
        public int HighThreshold { get; set; }
        public string LowLabel { get; set; }
        public string NormalLabel { get; set; }
        public string HighLabel { get; set; }
    }

    public class SuggestionTimeRange
    {
        public int MonthsBefore { get; set; }
        public int MonthsAfter { get; set; }
        public int YearsBack { get; set; }
    }

}
