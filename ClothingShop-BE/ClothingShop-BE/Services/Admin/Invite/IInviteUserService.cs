using ClothingShop_BE.ModelsDTO.Admin;
using System.Threading.Tasks;

namespace ClothingShop_BE.Services.Admin.Invite
{
    public interface IInviteUserService
    {
        Task InviteUserAsync(InviteUserDTO inviteUserDto);
    }
} 