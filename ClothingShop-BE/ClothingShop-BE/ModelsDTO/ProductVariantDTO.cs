using ClothingShop_BE.Models;
using Humanizer;

namespace ClothingShop_BE.ModelsDTO
{
    public class ProductVariantDTO
    {
        public long Id { get; set; }

        public long? ProductId { get; set; }

        public string? Size { get; set; }

        public int? Quantity { get; set; }


        public ProductVariantDTO() { }

        public ProductVariantDTO(ProductVariant productVariant)
        {
            Id = productVariant.Id;
            ProductId = productVariant.ProductId;
            Size = productVariant.Size;
            Quantity = productVariant.Quantity;
        }

        public ProductVariant ToProductVariant()
        {
            return new ProductVariant
            {
                Id = this.Id,
                ProductId = this.ProductId,
                Size = this.Size,
                Quantity = this.Quantity
            };
        }
    }
}
