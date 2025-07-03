using System;

namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class ReportAdminDTO
    {
        public long Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public long? ProductId { get; set; }
        public string ProductName { get; set; }
        public string? Reason { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
} 