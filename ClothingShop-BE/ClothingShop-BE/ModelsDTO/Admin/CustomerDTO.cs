namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class CustomerAdminDTO
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CustomerDetailDTO
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal AverageOrderValue { get; set; }
        public DateTime? LastOrderDate { get; set; }
    }

    public class CustomerOrderDTO
    {
        public Guid Id { get; set; }
        public decimal TotalAmount { get; set; }
        public int Status { get; set; }
        public string StatusName { get; set; } = null!;
        public DateTime CreateAt { get; set; }
        public int ItemCount { get; set; }
        public List<string> ProductNames { get; set; } = new List<string>();
    }

    public class CustomerStatisticsDTO
    {
        public int TotalCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public int InactiveCustomers { get; set; }
        public int BannedCustomers { get; set; }
        public int NewCustomersThisMonth { get; set; }
        public int CustomersWithOrders { get; set; }
        public double ConversionRate { get; set; }
    }

    public class UpdateCustomerStatusDTO
    {
        public int Status { get; set; }
    }
}
