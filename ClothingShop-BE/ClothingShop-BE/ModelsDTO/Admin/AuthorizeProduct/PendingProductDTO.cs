namespace ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct
{
    public class PendingProductDTO
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? Discount { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public DateTime? CreatedAt { get; set; }

        // Category info
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        // Seller info
        public Guid? SellerId { get; set; }
        public string? SellerName { get; set; }
        public string? SellerEmail { get; set; }

        // Product details
        public List<ProductVariantDTO>? ProductVariants { get; set; }
        public List<string>? ImageUrls { get; set; }
    }

   
}
