namespace ClothingShop_BE.Services.Admin
{
    public interface INotificationService
    {
        Task NotifyNewProduct(string productName, string userName);
        Task NotifyNewOrder(string orderId, string customerName, decimal totalAmount);
        Task NotifyGeneral(string message, string type = "info");
    }
}
