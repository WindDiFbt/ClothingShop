using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Email;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Services.Admin.Invite
{
    public class InviteUserService : IInviteUserService
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly ClothingShopPrn232G5Context _db;
        public InviteUserService(IEmailService emailService, IConfiguration config, ClothingShopPrn232G5Context db)
        {
            _emailService = emailService;
            _config = config;
            _db = db;
        }

        public async Task InviteUserAsync(InviteUserDTO inviteUserDto)
        {
            // Tùy chỉnh nội dung email mời
            var inviteLink = $"http://localhost:5173/admin/accounts/create-invite?email={Uri.EscapeDataString(inviteUserDto.Email)}&role={inviteUserDto.Role}";
            var subject = "Lời mời tham gia hệ thống ClothingShop";
            var body = $@"<p>Bạn đã được mời tham gia hệ thống với vai trò: {inviteUserDto.Role}</p><p>Email đăng nhập: {inviteUserDto.Email}</p><p><a href='{inviteLink}' style='display:inline-block;padding:10px 20px;background:#4361ee;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;'>Tạo tài khoản ngay</a></p>";
            await _emailService.SendEmailAsync(inviteUserDto.Email, subject, body);
        }

        public async Task CreateUserFromInviteAsync(CreateUserInviteDTO dto)
        {
            // Giả sử đã inject ClothingShopPrn232G5Context vào service
            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = dto.UserName,
                Email = dto.Email,
                Password = dto.Password, // Nên hash password ở đây nếu có
                Status = 1, // Active hoặc Pending tuỳ logic
                CreatedAt = DateTime.UtcNow
            };
            var userinfo = new Userinfo
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address,
                AvatarUrl = dto.AvatarUrl,
                UpdateAt = DateTime.UtcNow
            };
            var userRole = new UserRole
            {
                UserId = user.Id,
                RoleId = dto.RoleId
            };
            user.Userinfo = userinfo;
            user.UserRoles.Add(userRole);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }
    }
} 