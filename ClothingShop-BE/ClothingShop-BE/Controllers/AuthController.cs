using ClothingShop_BE.Models;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol.Plugins;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ClothingShopPrn232G5Context _con;
        public AuthController(IConfiguration config, ClothingShopPrn232G5Context con)
        {
            _config = config;
            _con = con;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var userLogin = _con.UserRoles
                .Include(u => u.User)
                .Include(u => u.Role)
                .FirstOrDefault(u => u.User.UserName == request.Username && u.User.Password == request.Password);
            
            if (userLogin != null)
            {
                var user = new
                {
                    Username = userLogin.User.UserName,
                    Role = userLogin.Role.Name,
                };

                var token = GenerateJwtToken(user.Username, user.Role);
                return Ok(new LoginResponse
                {
                    Token = token,
                    User = user
                });
            }

            return Unauthorized(new { message = "Username or password is incorrect" });
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

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }


    public class LoginResponse
    {
        public string Token { get; set; }
        public object User { get; set; }
    }

}
