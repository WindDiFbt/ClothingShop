using ClothingShop_BE.Models;
using ClothingShop_BE.Repository;
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
using ClothingShop_BE.AuthModels;
using ClothingShop_BE.RequestModels;
using ClothingShop_BE.Service.Impl;
using ClothingShop_BE.Repository.Impl;
using Microsoft.AspNetCore.Authorization;
namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserRepository _user;
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        public AuthController(IConfiguration config, IUserRepository user, IAuthService authService, IUserRepository userRepository)
        {
            _config = config;
            _user = user;
            _authService = authService;
            _userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestForm request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
                return Unauthorized(new { message = "Username or password is incorrect" });

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestForm request)
        {
            var result = await _authService.RegisterAsync(request);

            if (result.Contains("exists"))
                return BadRequest(new { message = result });

            return Ok(new { message = result });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userRepository.GetUserProfileAsync(Guid.Parse(userId));

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

    }


}
