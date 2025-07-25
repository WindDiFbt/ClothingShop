using ClothingShop_BE.Models;
using ClothingShop_BE.Repository;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.Extensions.Configuration.UserSecrets;
using ClothingShop_BE.AuthModels;
using ClothingShop_BE.Helpers;
using ClothingShop_BE.RequestModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace ClothingShop_BE.Service.Impl
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IConfiguration config, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _config = config;
            _jwtService = jwtService;
        }

        public async Task<string> RegisterAsync(RegisterRequestForm request)
        {
            if (await _userRepository.UserExistsAsync(request.UserName, request.Email))
                return "Username or Email already exists";

            var hashedPassword = HashHelper.ToSha256(request.Password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = request.UserName,
                Email = request.Email,
                Password = hashedPassword,
                Status = 1,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddUserAsync(user);
            return "User registered successfully";
        }
        public async Task<LoginResponseForm?> LoginAsync(LoginRequestForm request)
        {
            var userLogin = await _userRepository.GetUserForLoginAsync(request.Username, request.Password);

            if (userLogin == null)
                return null;

            var roles = new List<string> { userLogin.Value.Role };
            var token = _jwtService.GenerateToken(
                userLogin.Value.User.Id.ToString(),
                userLogin.Value.User.Email,
                roles
            );

            return new LoginResponseForm
            {
                Token = token,
                User = new
                {
                    Id = userLogin.Value.User.Id,
                    Username = userLogin.Value.User.UserName,
                    Role = userLogin.Value.Role
                }
            };
        }
    }
};
