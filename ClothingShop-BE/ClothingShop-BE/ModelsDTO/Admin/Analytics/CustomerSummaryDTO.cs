namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class CustomerSummaryDTO
    {
        // Basic Information
        public Guid CustomerId { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public int? Gender { get; set; }

        // Order Statistics
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal OrderCompletionRate { get; set; }

        // Dates
        public DateTime? LastPurchaseDate { get; set; }
        public DateTime? RegistrationDate { get; set; }

        // Activity Metrics
        public int FeedbackCount { get; set; }
        public decimal AverageRating { get; set; }
        public int WishlistCount { get; set; }
    }
}
