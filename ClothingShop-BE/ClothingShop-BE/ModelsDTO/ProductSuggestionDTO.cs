namespace ClothingShop_BE.ModelsDTO
{
    public class ProductSuggestionDTO
    {
        public long ProductId { get; set; }
        public string? ProductName { get; set; }
        public int TotalSold { get; set; }
        public string? ThumbnailUrl { get; set; }
    }
}
