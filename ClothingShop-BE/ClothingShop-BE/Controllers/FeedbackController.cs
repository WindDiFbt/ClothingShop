using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClothingShop_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetAllFeedbacksAsync(long productId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacksAsync(productId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FeedbackDTO>> CreateFeedback([FromBody] FeedbackDTO feedbackDTO)
        {
            try
            {
                // Lấy UserId từ JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                feedbackDTO.UserId = userId;
                var feedback = await _feedbackService.CreateFeedbackAsync(feedbackDTO);
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("order/{orderId}")]
        public IActionResult GetFeedbackByOrder(Guid orderId)
        {
            try
            {
                // Implement this method in service if needed
                return Ok(new List<FeedbackDTO>());
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
