namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class ReportFeedbackDTO
    {
        public long ReportId { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public int Status { get; set; }
    }
} 