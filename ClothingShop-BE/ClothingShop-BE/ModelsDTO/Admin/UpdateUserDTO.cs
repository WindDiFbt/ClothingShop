namespace ClothingShop_BE.ModelsDTO.Admin;

public class UpdateUserDTO
{
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public int? Status { get; set; }
    public List<int>? UserRoles { get; set; }
    public UpdateUserInfoDTO? Userinfo { get; set; }
}

public class UpdateUserInfoDTO
{
    public int? Gender { get; set; }
    public string? Address { get; set; }
    public string? AvatarUrl { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
}