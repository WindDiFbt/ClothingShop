namespace ClothingShop_BE.Services.Admin
{
    public interface INotificationService
    {
        Task NotifyNewProduct(string productName, string userName);
    }
}
