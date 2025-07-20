namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class OrderAdminDTO
    {
        public Guid Id { get; set; }
        public string? CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public int? TotalAmount { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public int ItemCount { get; set; }
    }

    public class OrderDetailAdminDTO
    {
        public Guid Id { get; set; }
        public string? CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public int? TotalAmount { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public List<OrderItemAdminDTO> OrderItems { get; set; } = new List<OrderItemAdminDTO>();
    }

    public class OrderItemAdminDTO
    {
        public long Id { get; set; }
        public long? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }
        public int? Quantity { get; set; }
        public int? UnitPrice { get; set; }
        public int? Discount { get; set; }
        public int? TotalPrice { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
    }

    public class UpdateOrderStatusDTO
    {
        public int Status { get; set; }
    }

    public class OrderStatusDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    public class OrderStatisticsDTO
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int ShippedOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public double? AverageOrderValue { get; set; }
    }
} 