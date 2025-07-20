namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class CategorySalesDTO
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int OrderCount { get; set; }
        public int ProductCount { get; set; }
        public double Percentage { get; set; }
    }

    public class CategorySalesResponseDTO
    {
        public List<CategorySalesDTO> CategoryData { get; set; } = new List<CategorySalesDTO>();
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
} 