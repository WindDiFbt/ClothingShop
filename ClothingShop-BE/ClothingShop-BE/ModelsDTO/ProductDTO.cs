using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class ProductDTO
    {
        public long Id { get; set; }
        public Guid? SellerId { get; set; }
        public string? Name { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? Discount { get; set; }
        public int? Status { get; set; }
        public int? CurrentPrice { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public List<string> Images { get; set; }
        public ProductDTO() { }
        public List<ProductVariantDTO> ProductVariants { get; set; }
        public ProductDTO(Product product)
        {
            Id = product.Id;
            SellerId = product.SellerId;
            Name = product.Name;
            CategoryId = product.CategoryId;
            CategoryName = product.Category?.Name;
            ThumbnailUrl = product.ThumbnailUrl;
            Description = product.Description;
            Price = product.Price;
            Discount = product.Discount;
            Status = product.Status;
            CurrentPrice = (int)(product.Price * (1 - (product.Discount ?? 0) / 100.0));
            CreateAt = product.CreateAt;
            UpdateAt = product.UpdateAt;
            Images =  product.Images?.Select(i => i.Url).ToList();
            ProductVariants = product.ProductVariants?.Select(x => new ProductVariantDTO(x)).ToList();
        }

        public Product ToProduct()
        {
            return new Product
            {
                Id = this.Id,
                SellerId = this.SellerId,
                Name = this.Name,
                CategoryId = this.CategoryId,
                ThumbnailUrl = this.ThumbnailUrl,
                Description = this.Description,
                Price = this.Price,
                Discount = this.Discount,
                Status = this.Status,
                CreateAt = this.CreateAt
            };
        }
    }
}
