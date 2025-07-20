using ClothingShop_BE.ModelsDTO.Admin;
using ClothingShop_BE.Services.Admin.Invite;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class InviteController : ControllerBase
    {
        private readonly IInviteUserService _inviteUserService;
        public InviteController(IInviteUserService inviteUserService)
        {
            _inviteUserService = inviteUserService;
        }

        [HttpPost]
        public async Task<IActionResult> Invite([FromBody] InviteUserDTO inviteUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                await _inviteUserService.InviteUserAsync(inviteUserDto);
                return Ok(new { message = "Gửi lời mời thành công" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Không thể gửi lời mời", error = ex.Message });
            }
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUserFromInvite([FromBody] CreateUserInviteDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                await _inviteUserService.CreateUserFromInviteAsync(dto);
                return Ok(new { message = "Tạo user thành công" });
            }
            catch (InvalidOperationException ex)
            {
                // Trả về lỗi validation với status code 400
                return BadRequest(new { message = ex.Message });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Không thể tạo user", error = ex.Message });
            }
        }
    }
} 