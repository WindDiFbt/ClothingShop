using ClothingShop_BE.Services.Admin;
using Microsoft.AspNetCore.Mvc;

namespace ClothingShop_BE.Controllers.Admin
{
    [Route("api/admin/test-notifications")]
    [ApiController]
    public class TestNotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public TestNotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("product")]
        public async Task<IActionResult> TestProductNotification([FromBody] TestProductNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyNewProduct(request.ProductName, request.UserName);
                return Ok(new { message = "Product notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending product notification", error = ex.Message });
            }
        }

        [HttpPost("order")]
        public async Task<IActionResult> TestOrderNotification([FromBody] TestOrderNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyNewOrder(request.OrderId, request.CustomerName, request.TotalAmount);
                return Ok(new { message = "Order notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending order notification", error = ex.Message });
            }
        }

        [HttpPost("general")]
        public async Task<IActionResult> TestGeneralNotification([FromBody] TestGeneralNotificationRequest request)
        {
            try
            {
                await _notificationService.NotifyGeneral(request.Message, request.Type);
                return Ok(new { message = "General notification sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending general notification", error = ex.Message });
            }
        }
    }

    public class TestProductNotificationRequest
    {
        public string ProductName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }

    public class TestOrderNotificationRequest
    {
        public string OrderId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class TestGeneralNotificationRequest
    {
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = "info";
    }
} 