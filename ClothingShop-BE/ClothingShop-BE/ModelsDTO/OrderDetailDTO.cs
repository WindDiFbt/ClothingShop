using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class OrderDetailDTO
    {
        public long Id { get; set; }
        public Guid OrderId { get; set; }
        public long? ProductId { get; set; }
        public string? ProductName { get; set; }
        public int? Quantity { get; set; }
        public int? UnitPrice { get; set; }
        public int? Discount { get; set; }
        public int? TotalPrice { get; set; }
        public int? Status { get; set; }

        // Product information
        public ProductDTO? Product { get; set; }

        // Feedback information
        public FeedbackDTO? Feedback { get; set; }
        public bool HasFeedback { get; set; }

        public OrderDetailDTO() { }

        public OrderDetailDTO(OrderDetail detail)
        {
            Id = detail.Id;
            OrderId = detail.OrderId;
            ProductId = detail.ProductId;
            ProductName = detail.Product?.Name;
            Quantity = detail.Quantity;
            UnitPrice = detail.UnitPrice;
            Discount = detail.Discount;
            TotalPrice = detail.TotalPrice;
            Status = detail.Status;

            // Map product information if available
            if (detail.Product != null)
            {
                Product = new ProductDTO(detail.Product);
            }

            // Initialize feedback properties
            HasFeedback = false;
        }

        public OrderDetail ToOrderDetail()
        {
            return new OrderDetail
            {
                Id = this.Id,
                OrderId = this.OrderId,
                ProductId = this.ProductId,
                Quantity = this.Quantity,
                UnitPrice = this.UnitPrice,
                Discount = this.Discount,
                TotalPrice = this.TotalPrice,
                Status = this.Status
            };
        }
    }
}
