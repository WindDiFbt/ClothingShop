namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{


    public class ReportTypeData
    {
        public string? ReportType { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class DailyReports
    {
        public DateTime Date { get; set; }
        public int NewReports { get; set; }
        public int ResolvedReports { get; set; }
    }
} 