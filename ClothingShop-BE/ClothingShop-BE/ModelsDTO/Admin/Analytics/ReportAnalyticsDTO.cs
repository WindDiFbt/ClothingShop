namespace ClothingShop_BE.ModelsDTO.Admin.Analytics
{
    public class ReportAnalyticsDTO
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int ResolvedReports { get; set; }
        public decimal AverageResolutionTime { get; set; }
        public List<ReportTypeData> ReportTypes { get; set; } = new List<ReportTypeData>();
        public List<DailyReports> DailyData { get; set; } = new List<DailyReports>();
    }

    public class ReportTypeData
    {
        public string ReportType { get; set; }
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