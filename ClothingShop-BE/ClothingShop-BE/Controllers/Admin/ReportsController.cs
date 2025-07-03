using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Reports;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportAdminService _reportService;
        public ReportsController(IReportAdminService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportAdminDTO>>> GetAllReports()
        {
            var reports = await _reportService.GetAllReportsAsync();
            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportAdminDTO>> GetReportDetail(long id)
        {
            var report = await _reportService.GetReportDetailAsync(id);
            if (report == null) return NotFound();
            return Ok(report);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReportStatus(long id, [FromBody] int status)
        {
            var result = await _reportService.UpdateReportStatusAsync(id, status);
            if (!result) return NotFound();
            return Ok();
        }
    }
} 