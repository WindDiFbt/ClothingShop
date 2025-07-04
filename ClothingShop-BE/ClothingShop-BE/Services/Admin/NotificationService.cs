using ClothingShop_BE.Services.Admin.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace ClothingShop_BE.Services.Admin
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyNewProduct(string productName, string userName)
        {
            var message = $"Sản phẩm mới '{productName}' đã được thêm bởi {userName}";
            await _hubContext.Clients.Group("Admins").SendAsync("ReceiveProductNotification", message);
        }
    }
}
