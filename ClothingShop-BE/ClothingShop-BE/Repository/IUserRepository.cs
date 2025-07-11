using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IUserRepository
    {
        UserRole GetUserForLogin(string username, string password);
        Task<bool> UserExistsAsync(string username, string email);
        Task AddUserAsync(User user);
        Task<(User User, string Role)?> GetUserForLoginAsync(string username, string password);
        Task<User?> GetUserByIdAsync(Guid userId);

        Task<object?> GetUserProfileAsync(Guid userId);
    }
}
