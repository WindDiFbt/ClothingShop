using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClothingShop_BE.Services.Admin.Reports
{
    public class ReportAdminService : IReportAdminService
    {
        private readonly ClothingShopPrn232G5Context _context;
        public ReportAdminService(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<List<ReportAdminDTO>> GetAllReportsAsync()
        {
            return await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.StatusNavigation)
                .Select(r => new ReportAdminDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.Userinfo.FullName,
                    ProductId = r.ProductId,
                    ProductName = r.Product.Name,
                    Reason = r.Reason,
                    Status = r.Status,
                    StatusName = r.StatusNavigation.Name,
                    CreateAt = r.CreateAt,
                    UpdateAt = r.UpdateAt
                })
                .ToListAsync();
        }

        public async Task<ReportAdminDTO?> GetReportDetailAsync(long id)
        {
            var r = await _context.Reports
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.StatusNavigation)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (r == null) return null;
            return new ReportAdminDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User.Userinfo.FullName,
                ProductId = r.ProductId,
                ProductName = r.Product.Name,
                Reason = r.Reason,
                Status = r.Status,
                StatusName = r.StatusNavigation.Name,
                CreateAt = r.CreateAt,
                UpdateAt = r.UpdateAt
            };
        }

        public async Task<bool> UpdateReportStatusAsync(long id, int status)
        {
            var r = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);
            if (r == null) return false;
            r.Status = status;
            r.UpdateAt = System.DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 