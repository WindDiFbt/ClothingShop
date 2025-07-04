using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace ClothingShop_BE.Services.Admin.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
        }

        public async Task SendProductNotification(string message)
        {
            await Clients.Group("Admins").SendAsync("ReceiveProductNotification", message);
        }
    }
}
