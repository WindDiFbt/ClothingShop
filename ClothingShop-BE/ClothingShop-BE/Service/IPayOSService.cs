using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface IPayOSService
    {
        Task<PayOSCreatePaymentResponse> CreatePaymentLinkAsync(PayOSCreatePaymentRequest request);
        Task<PayOSPaymentInfo> GetPaymentInfoAsync(string paymentLinkId);
        Task<PayOSPaymentInfo> CancelPaymentLinkAsync(string paymentLinkId, string cancellationReason);
        bool VerifyWebhookSignature(string signature, string data);
        string GenerateSignature(string data);
        Task<bool> ProcessWebhookAsync(PayOSWebhookData webhookData);
    }
}
