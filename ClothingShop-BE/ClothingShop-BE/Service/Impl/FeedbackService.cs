using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Repository;

namespace ClothingShop_BE.Service.Impl
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository,
            IOrderRepository orderRepository,
            IOrderDetailRepository orderDetailRepository)
        {
            _feedbackRepository = feedbackRepository;
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
        }

        public async Task<IEnumerable<FeedbackDTO>> GetAllFeedbacksAsync(long productId)
        {
            var feedbacks = (await _feedbackRepository.GetAllFeedbackAsync(productId)).Select(x => new FeedbackDTO(x));
            if (!feedbacks.Any())
            {
                throw new KeyNotFoundException($"Product does not exist ID: {productId}");
            }
            return feedbacks;
        }

        public async Task<FeedbackDTO> CreateFeedbackAsync(FeedbackDTO feedbackDTO)
        {
            if (feedbackDTO == null || string.IsNullOrWhiteSpace(feedbackDTO.Comment) || !feedbackDTO.ProductId.HasValue)
            {
                throw new Exception("Feedback is empty or invalid.");
            }
            if (await _feedbackRepository.HasFeedbackExistAsync(feedbackDTO.ProductId.Value, feedbackDTO.OrderId))
            {
                throw new Exception($"User feedbacked for this product in order: {feedbackDTO.OrderId}");
            }
            if (!(await _orderRepository.HasUserOrderedAsync(feedbackDTO.UserId, feedbackDTO.OrderId)))
            {
                throw new InvalidOperationException($"UserId: {feedbackDTO.UserId} do not have permission to access this order.");
            }
            if (!(await _orderDetailRepository.HasOrderDetailExistAsync(feedbackDTO.OrderId, feedbackDTO.ProductId.Value)))
            {
                throw new InvalidOperationException("User's order detail does not exist!");
            }
            Feedback feedback = new Feedback
            {
                UserId = feedbackDTO.UserId,
                OrderId = feedbackDTO.OrderId,
                ProductId = feedbackDTO.ProductId.Value,
                Rating = feedbackDTO.Rating,
                Comment = feedbackDTO.Comment,
                CreateAt = DateTime.Now,
            };
            var result = await _feedbackRepository.SaveFeedback(feedback);
            return new FeedbackDTO(result);
        }

    }
}
