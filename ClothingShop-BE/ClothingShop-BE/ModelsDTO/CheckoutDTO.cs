using System.ComponentModel.DataAnnotations;

namespace ClothingShop_BE.ModelsDTO
{
    public class CheckoutRequestDTO
    {
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(15)]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Note { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = "COD"; // COD, Bank Transfer, E-Wallet
    }

    public class CheckoutResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Guid? OrderId { get; set; }

        // Additional order information
        public string? OrderCode { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime? OrderDate { get; set; }

        // For payment redirect if needed
        public string? PaymentUrl { get; set; }
    }
}
