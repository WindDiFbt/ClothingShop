using System.ComponentModel.DataAnnotations;

namespace ClothingShop_BE.ModelsDTO.Admin
{
    public class InviteUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int Role { get; set; }
    }
} 