using Xunit;
using ClothingShop_BE.Services.Admin.Invite;
using ClothingShop_BE.Services.Admin.Email;
using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using Moq;

namespace TestProject_ClothingShop.Admin
{
    public class InviteUserServiceTest
    {
        private ClothingShopPrn232G5Context GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ClothingShopPrn232G5Context>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new ClothingShopPrn232G5Context(options);
        }

        [Fact]
        public async Task InviteUserAsync_ValidInput_SendsEmail()
        {
            using var context = GetInMemoryContext();
            var mockEmailService = new Moq.Mock<IEmailService>();
            var mockConfig = new Moq.Mock<IConfiguration>();
            var service = new InviteUserService(mockEmailService.Object, mockConfig.Object, context);
            var dto = new InviteUserDTO { Email = "test@email.com", Role = 2 };
            await service.InviteUserAsync(dto);
            mockEmailService.Verify(e => e.SendEmailAsync(
                dto.Email,
                It.IsAny<string>(),
                It.Is<string>(body => body.Contains(dto.Email))
            ), Times.Once);
        }

        [Fact]
        public async Task CreateUserFromInviteAsync_ValidInput_CreatesUser()
        {
            using var context = GetInMemoryContext();
            var mockEmailService = new Moq.Mock<IEmailService>();
            var mockConfig = new Moq.Mock<IConfiguration>();
            var service = new InviteUserService(mockEmailService.Object, mockConfig.Object, context);
            var dto = new CreateUserInviteDTO { Email = "test@email.com", UserName = "testuser", Password = "123", FullName = "Test User", PhoneNumber = "123456789", Gender = 1, DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow), Address = "Test Address", AvatarUrl = "", RoleId = 1 };
            await service.CreateUserFromInviteAsync(dto);
            var user = context.Users.FirstOrDefault(u => u.Email == dto.Email);
            Assert.NotNull(user);
            Assert.Equal(dto.UserName, user.UserName);
            Assert.Equal(dto.Email, user.Email);
        }

        [Fact]
        public async Task CreateUserFromInviteAsync_ExistingEmail_ThrowsException()
        {
            using var context = GetInMemoryContext();
            context.Users.Add(new User { Email = "exist@email.com", UserName = "testuser" });
            context.SaveChanges();
            var mockEmailService = new Moq.Mock<IEmailService>();
            var mockConfig = new Moq.Mock<IConfiguration>();
            var service = new InviteUserService(mockEmailService.Object, mockConfig.Object, context);
            var dto = new CreateUserInviteDTO { Email = "exist@email.com", UserName = "testuser", Password = "123", FullName = "Test User", PhoneNumber = "123456789", Gender = 1, DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow), Address = "Test Address", AvatarUrl = "", RoleId = 1 };
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateUserFromInviteAsync(dto));
            Assert.Contains("Email", ex.Message);
        }
    }
} 