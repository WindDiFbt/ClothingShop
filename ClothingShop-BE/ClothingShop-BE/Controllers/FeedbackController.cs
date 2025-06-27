using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            var feedbacks = await _feedbackService.GetAllFeedbacksAsync(productId);
            return Ok(feedbacks);
        }

        [HttpPost("create")]
        public async Task<ActionResult<FeedbackDTO>> CreateFeedback(FeedbackDTO feedbackDTO)
        {
            var feedback = await _feedbackService.CreateFeedbackAsync(feedbackDTO);
            return CreatedAtAction(
                nameof(CreateFeedback),
                new { feedbackId = feedback.Id },
                feedback);
        }
    }
}
