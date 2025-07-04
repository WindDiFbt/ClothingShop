using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClothingShop_BE.Services.Admin.Email;
using System;

namespace ClothingShop_BE.Services.Admin.Reports
{
    public class ReportAdminService : IReportAdminService
    {
        private readonly ClothingShopPrn232G5Context _context;
        private readonly IEmailService _emailService;
        public ReportAdminService(ClothingShopPrn232G5Context context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<List<ReportAdminDTO>> GetAllReportsAsync()
        {
            return await _context.Reports
                .Include(r => r.User)
                .ThenInclude(u => u.Userinfo)
                .Include(r => r.Product)
                .Include(r => r.StatusNavigation)
                .Select(r => new ReportAdminDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.Userinfo != null ? r.User.Userinfo.FullName : r.User.UserName,
                    ProductId = r.ProductId,
                    ProductName = r.Product != null ? r.Product.Name : null,
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
                .ThenInclude(u => u.Userinfo)
                .Include(r => r.Product)
                .Include(r => r.StatusNavigation)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (r == null) return null;
            return new ReportAdminDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User.Userinfo != null ? r.User.Userinfo.FullName : r.User.UserName,
                ProductId = r.ProductId,
                ProductName = r.Product != null ? r.Product.Name : null,
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

        public async Task SendReportFeedbackAsync(ReportFeedbackDTO dto)
        {
            var report = await _context.Reports.Include(r => r.User).FirstOrDefaultAsync(r => r.Id == dto.ReportId);
            if (report == null) throw new Exception("Report not found");
            var email = report.User.Email;
            var subject = $"Phản hồi báo cáo #{dto.ReportId}";
            var statusText = dto.Status switch
            {
                1 => "Chờ xử lý",
                2 => "Đang xử lý",
                3 => "Đã xử lý",
                4 => "Đã từ chối",
                _ => "Không xác định"
            };
            var body = $@"<p>Phản hồi của admin: {dto.Feedback}</p><p>Trạng thái báo cáo: <b>{statusText}</b></p>";
            await _emailService.SendEmailAsync(email, subject, body);
        }
    }
} 