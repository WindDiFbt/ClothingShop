using System;
using System.Collections.Generic;

namespace ClothingShop_BE.ModelsDTO;

public class UserAccountDTO
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public DateTime? CreatedAt { get; set; }
    public int? Status { get; set; }
    public List<int?>? UserRoles { get; set; }
    public UserinfoDTO? Userinfo { get; set; }
}

public class UserinfoDTO
{
    public Guid UserinfoId { get; set; }

    public string? FullName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? AvatarUrl { get; set; }

    public int? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Address { get; set; }

    public DateTime? UpdateAt { get; set; }
}