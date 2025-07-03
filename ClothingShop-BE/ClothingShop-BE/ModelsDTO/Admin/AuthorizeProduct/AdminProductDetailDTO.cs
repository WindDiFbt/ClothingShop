using System;
using System.Collections.Generic;

namespace ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct
{
    public class AdminProductDetailDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? Price { get; set; }

        public int? Discount { get; set; }
        public int? Status { get; set; }
        public string StatusName { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string CategoryName { get; set; }
        public string SellerName { get; set; }
        public string SellerEmail { get; set; }
        public List<string> ImageUrls { get; set; }
        public List<ProductVariantDTO> ProductVariants { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime? RejectedAt { get; set; }
    }
} 