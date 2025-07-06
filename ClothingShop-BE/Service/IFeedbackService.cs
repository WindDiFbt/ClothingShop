using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service;

public interface IFeedbackService
{
    void AddFeedback(FeedbackCreateDTO feedbackDto);
    IEnumerable<FeedbackResponseDTO> GetFeedbackByProduct(long productId);
    IEnumerable<FeedbackResponseDTO> GetFeedbackByOrder(Guid orderId);
}
