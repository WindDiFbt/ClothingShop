namespace ClothingShop_BE.ModelsDTO
{
    public class ProductStockDto
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public List<ProductVariantStockDto> Variants { get; set; } = new();
    }
    public class ProductVariantStockDto
    {
        public long VariantId { get; set; }
        public string Size { get; set; }
        public int Quantity { get; set; }
        public string StockStatus { get; set; } // Low / Normal / High
    }
}
