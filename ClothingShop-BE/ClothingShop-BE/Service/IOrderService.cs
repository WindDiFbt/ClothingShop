using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface IOrderService
    {
        Task<CheckoutResponseDTO> CreateOrderAsync(CheckoutRequestDTO request, Guid userId);
        Task<OrderDTO?> GetOrderByIdAsync(Guid orderId, Guid userId);
        Task<List<OrderDTO>> GetUserOrdersAsync(Guid userId);
        Task<OrderDTO?> UpdateOrderStatusAsync(Guid orderId, int status);
        Task<bool> CancelOrderAsync(Guid orderId, Guid userId);
        Task<bool> ValidateCheckoutAsync(CheckoutRequestDTO request);
    }
}
