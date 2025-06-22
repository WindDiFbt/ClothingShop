using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<Feedback>> Get3FeedbackAsync(long ProductId);
    }
}
