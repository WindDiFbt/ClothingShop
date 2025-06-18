using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;

        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // TODO: Validate user credentials với database
            // Đây chỉ là ví dụ demo
            if (request.Email == "admin" && request.Password == "123")
            {
                var token = _jwtService.GenerateToken(
                    userId: "1",
                email: request.Email,
                    roles: new List<string> { "Admin" }
                );

                return Ok(new LoginResponse
                {
                    Token = token,
                    Email = request.Email,
                    ExpiresIn = 3600 // seconds
                });
            }

            return Unauthorized(new { message = "Invalid credentials" });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public int ExpiresIn { get; set; }
    }
}
