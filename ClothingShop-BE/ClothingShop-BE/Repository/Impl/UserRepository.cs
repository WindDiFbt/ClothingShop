using Azure.Core;
using ClothingShop_BE.Helpers;
using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class UserRepository : IUserRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public UserRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }
        public UserRole GetUserForLogin(string username, string password)
        {
            return _context.UserRoles
                .Include(u => u.User)
            .Include(u => u.Role)
            .FirstOrDefault(u => u.User.UserName == username && u.User.Password == password);
        }
        public async Task<bool> UserExistsAsync(string username, string email)
        {
            return await _context.Users.AnyAsync(u => u.UserName == username || u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            var role = new UserRole
            {
                UserId = user.Id,
                RoleId = 3
            };
            _context.UserRoles.Add(role);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        public async Task<(User User, string Role)?> GetUserForLoginAsync(string username, string password)
        {
            var hashedPassword = HashHelper.ToSha256(password);

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == username && u.Password == hashedPassword);

            if (user == null)
                return null;

            var role = user.UserRoles.FirstOrDefault()?.Role?.Name;
            var usernameresponse = user.UserName;
            return (User: user, Role: role);
        }

    }
}
