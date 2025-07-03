using ClothingShop_BE.ModelsDTO.Admin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClothingShop_BE.Services.Admin.Reports
{
    public interface IReportAdminService
    {
        Task<List<ReportAdminDTO>> GetAllReportsAsync();
        Task<ReportAdminDTO?> GetReportDetailAsync(long id);
        Task<bool> UpdateReportStatusAsync(long id, int status);
    }
} 