using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClothingShop_BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;

    public FeedbackController(IFeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    [HttpPost]
    [Authorize]
    public IActionResult AddFeedback([FromBody] FeedbackCreateDTO feedbackDto)
    {
        _feedbackService.AddFeedback(feedbackDto);
        return Ok();
    }

    [HttpGet("product/{productId}")]
    public IActionResult GetFeedbackByProduct(long productId)
    {
        var feedbacks = _feedbackService.GetFeedbackByProduct(productId);
        return Ok(feedbacks);
    }

    [HttpGet("order/{orderId}")]
    public IActionResult GetFeedbackByOrder(Guid orderId)
    {
        var feedbacks = _feedbackService.GetFeedbackByOrder(orderId);
        return Ok(feedbacks);
    }
}
