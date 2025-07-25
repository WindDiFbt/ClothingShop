using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository;

public interface IFeedbackRepository
{
    void AddFeedback(Feedback feedback);
    IEnumerable<Feedback> GetFeedbackByProduct(long productId);
    IEnumerable<Feedback> GetFeedbackByOrder(Guid orderId);
    bool HasPurchasedProduct(Guid userId, long productId);
}
