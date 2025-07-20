using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace ClothingShop_BE.Services.Admin.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
            Console.WriteLine($"Admin joined: {Context.ConnectionId}");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
            Console.WriteLine($"Admin left: {Context.ConnectionId}");
        }

        public async Task SendProductNotification(string message)
        {
            await Clients.Group("Admins").SendAsync("ReceiveProductNotification", message);
        }

        public async Task SendOrderNotification(string message)
        {
            await Clients.Group("Admins").SendAsync("ReceiveOrderNotification", message);
        }

        public async Task SendGeneralNotification(string message, string type = "info")
        {
            await Clients.Group("Admins").SendAsync("ReceiveGeneralNotification", message, type);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
