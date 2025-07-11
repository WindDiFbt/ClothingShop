using ClothingShop_BE.Models;
using ClothingShop_BE.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _user;

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var user = await _user.GetUserByIdAsync(Guid.Parse(userIdClaim));

            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.Status,
                user.CreatedAt,
                Userinfo = user.Userinfo == null ? null : new
                {
                    user.Userinfo.FullName,
                    user.Userinfo.Address,
                    user.Userinfo.PhoneNumber
                }
            });
        }

    }
}
