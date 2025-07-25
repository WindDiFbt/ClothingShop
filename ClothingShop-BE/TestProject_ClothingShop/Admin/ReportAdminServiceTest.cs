using Xunit;
using ClothingShop_BE.Services.Admin.Reports;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Moq;

namespace TestProject_ClothingShop.Admin
{
    public class ReportAdminServiceTest
    {
        private ClothingShopPrn232G5Context GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ClothingShopPrn232G5Context>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new ClothingShopPrn232G5Context(options);
        }

        [Fact]
        public async Task GetAllReportsAsync_ReturnsAllReports()
        {
            using var context = GetInMemoryContext();
            context.Reports.Add(new Report { Id = 1, Status = 1, User = new User { Userinfo = new Userinfo { FullName = "User1" }, UserName = "user1" }, Product = new Product { Name = "Product1" }, StatusNavigation = new ReportStatus { Id = 1, Name = "Pending" }, CreateAt = DateTime.Now, UpdateAt = DateTime.Now });
            context.SaveChanges();
            var mockEmailService = new Moq.Mock<ClothingShop_BE.Services.Admin.Email.IEmailService>();
            var service = new ReportAdminService(context, mockEmailService.Object);
            var result = await service.GetAllReportsAsync();
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(1, result[0].Id);
            Assert.Equal("Pending", result[0].StatusName);
        }

        [Fact]
        public async Task GetReportDetailAsync_ValidId_ReturnsDetail()
        {
            using var context = GetInMemoryContext();
            context.Reports.Add(new Report { Id = 1, Status = 1, User = new User { Userinfo = new Userinfo { FullName = "User1" }, UserName = "user1" }, Product = new Product { Name = "Product1" }, StatusNavigation = new ReportStatus { Id = 1, Name = "Pending" }, CreateAt = DateTime.Now, UpdateAt = DateTime.Now });
            context.SaveChanges();
            var mockEmailService = new Moq.Mock<ClothingShop_BE.Services.Admin.Email.IEmailService>();
            var service = new ReportAdminService(context, mockEmailService.Object);
            var result = await service.GetReportDetailAsync(1);
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("Pending", result.StatusName);
        }

        [Fact]
        public async Task UpdateReportStatusAsync_ValidId_UpdatesStatus()
        {
            using var context = GetInMemoryContext();
            context.Reports.Add(new Report { Id = 1, Status = 1 });
            context.SaveChanges();
            var mockEmailService = new Moq.Mock<ClothingShop_BE.Services.Admin.Email.IEmailService>();
            var service = new ReportAdminService(context, mockEmailService.Object);
            var result = await service.UpdateReportStatusAsync(1, 3);
            Assert.True(result);
            var updated = await context.Reports.FindAsync(1L);
            Assert.Equal(3, updated.Status);
        }

        [Fact]
        public async Task SendReportFeedbackAsync_ValidInput_SendsEmail()
        {
            using var context = GetInMemoryContext();
            context.Reports.Add(new Report { Id = 1, User = new User { Email = "user@email.com" } });
            context.SaveChanges();
            var mockEmailService = new Moq.Mock<ClothingShop_BE.Services.Admin.Email.IEmailService>();
            var service = new ReportAdminService(context, mockEmailService.Object);
            var dto = new ReportFeedbackDTO { ReportId = 1, Feedback = "Test feedback", Status = 3 };
            await service.SendReportFeedbackAsync(dto);
            mockEmailService.Verify(e => e.SendEmailAsync(
                "user@email.com",
                It.IsAny<string>(),
                It.Is<string>(body => body.Contains(dto.Feedback))
            ), Times.Once);
        }
    }
} 