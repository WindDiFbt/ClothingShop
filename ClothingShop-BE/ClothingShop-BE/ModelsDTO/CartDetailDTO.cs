using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class CartDetailDTO
    {
        public Guid CartId { get; set; }
        public long ProductId { get; set; }
        public int? Quantity { get; set; }
        public int? TotalPrice { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        // Add product information
        public ProductDTO? Product { get; set; }

        public CartDetailDTO() { }

        public CartDetailDTO(CartDetail detail)
        {
            CartId = detail.CartId;
            ProductId = detail.ProductId;
            Quantity = detail.Quantity;
            TotalPrice = detail.TotalPrice;
            CreateAt = detail.CreateAt;
            UpdateAt = detail.UpdateAt;

            // Include product information if available
            if (detail.Product != null)
            {
                Product = new ProductDTO(detail.Product);
            }
        }

        public CartDetail ToCartDetail()
        {
            return new CartDetail
            {
                CartId = this.CartId,
                ProductId = this.ProductId,
                Quantity = this.Quantity,
                TotalPrice = this.TotalPrice,
                CreateAt = this.CreateAt,
                UpdateAt = this.UpdateAt
            };
        }
    }
}