namespace ClothingShop_BE.ModelsDTO
{
    public class ProductRevenueDTO
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public int TotalSold { get; set; }
        public int TotalRevenue { get; set; }

        public List<SizeRevenueDTO> Sizes { get; set; } = new();
    }

    public class SizeRevenueDTO
    {
        public string Size { get; set; }
        public int Quantity { get; set; }
        public int Revenue { get; set; }
    }

}
