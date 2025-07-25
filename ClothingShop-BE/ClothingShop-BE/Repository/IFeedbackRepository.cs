using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IFeedbackRepository
    {
        Task<List<Feedback>> Get3FeedbackNewestAsync(long ProductId);

        Task<List<Feedback>> GetAllFeedbackAsync(long productId);

        Task<bool> HasFeedbackExistAsync(long productId, Guid orderId);

        Task<Feedback?> GetFeedbackByOrderAndProductAsync(Guid orderId, long productId);

        Task<Feedback> SaveFeedback(Feedback feedback);
    }
}
