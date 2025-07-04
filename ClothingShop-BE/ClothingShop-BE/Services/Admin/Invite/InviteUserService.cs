using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Email;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace ClothingShop_BE.Services.Admin.Invite
{
    public class InviteUserService : IInviteUserService
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        public InviteUserService(IEmailService emailService, IConfiguration config)
        {
            _emailService = emailService;
            _config = config;
        }

        public async Task InviteUserAsync(InviteUserDTO inviteUserDto)
        {
            // Tùy chỉnh nội dung email mời
            var subject = "Lời mời tham gia hệ thống ClothingShop";
            var body = $@"<p>Bạn đã được mời tham gia hệ thống với vai trò: {inviteUserDto.Role}</p><p>Email đăng nhập: {inviteUserDto.Email}</p>";
            await _emailService.SendEmailAsync(inviteUserDto.Email, subject, body);
        }
    }
} 