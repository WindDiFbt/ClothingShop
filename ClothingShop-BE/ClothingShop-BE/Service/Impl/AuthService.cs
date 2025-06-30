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

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
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
            return "Registration successful";
        }
        public async Task<LoginResponseForm?> LoginAsync(LoginRequestForm request)
        {
            var userLogin = await _userRepository.GetUserForLoginAsync(request.Username, request.Password);

            if (userLogin == null)
                return null;

            var token = GenerateJwtToken(userLogin.Value.User.UserName, userLogin.Value.Role);

            return new LoginResponseForm
            {
                Token = token,
                User = new
                {
                    Username = userLogin.Value.User.UserName,
                    Role = userLogin.Value.Role
                }
            };
        }

        private string GenerateJwtToken(string username, string role)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, username),
        new Claim(ClaimTypes.Role, role)
    };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }

}
