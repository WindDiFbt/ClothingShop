using ClothingShop_BE.ModelsDTO;

namespace ClothingShop_BE.Service
{
    public interface IFeedbackService
    {
        Task<IEnumerable<FeedbackDTO>> GetAllFeedbacksAsync(long productId);

        Task<FeedbackDTO> CreateFeedbackAsync(FeedbackDTO feedbackDTO);

    }
}
