namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class CustomerAnalyticsDTO
    {
        public int TotalCustomers { get; set; }
        public int NewCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public decimal CustomerGrowth { get; set; }
        public List<CustomerSegment> Segments { get; set; } = new List<CustomerSegment>();
        public List<CustomerRegistration> RegistrationData { get; set; } = new List<CustomerRegistration>();
    }

    public class CustomerSegment
    {
        public string SegmentName { get; set; }
        public int CustomerCount { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal AverageSpent { get; set; }
    }

    public class CustomerRegistration
    {
        public DateTime Date { get; set; }
        public int NewCustomers { get; set; }
    }
} 