using System;
using System.ComponentModel.DataAnnotations;

namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class CreateUserInviteDTO
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [StringLength(64, MinimumLength = 3, ErrorMessage = "Tên đăng nhập phải có từ 3 đến 64 ký tự")]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(64, ErrorMessage = "Email không được vượt quá 64 ký tự")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(64, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có từ 6 đến 64 ký tự")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Họ và tên là bắt buộc")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Họ và tên phải có từ 2 đến 100 ký tự")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [RegularExpression(@"^[0-9]{10,11}$", ErrorMessage = "Số điện thoại phải có 10-11 số")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giới tính là bắt buộc")]
        [Range(1, 3, ErrorMessage = "Giới tính không hợp lệ")]
        public int? Gender { get; set; }

        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        public DateOnly? DateOfBirth { get; set; }

        [Required(ErrorMessage = "Địa chỉ là bắt buộc")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Địa chỉ phải có từ 5 đến 200 ký tự")]
        public string Address { get; set; } = string.Empty;

        public string AvatarUrl { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vai trò là bắt buộc")]
        [Range(1, 3, ErrorMessage = "Vai trò không hợp lệ")]
        public int RoleId { get; set; }
    }
} 