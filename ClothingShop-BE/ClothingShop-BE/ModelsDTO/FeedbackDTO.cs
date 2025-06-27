using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class FeedbackDTO
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public long? ProductId { get; set; }
        public Guid OrderId { get; set; }
        public byte? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreateAt { get; set; }
        public string? UserName { get; set; }
        public string? Avatar { get; set; }

        public FeedbackDTO() { }

        public FeedbackDTO(Feedback feedback)
        {
            Id = feedback.Id;
            UserId = feedback.UserId;
            ProductId = feedback.ProductId;
            OrderId = feedback.OrderId;
            Rating = feedback.Rating;
            Comment = feedback.Comment;
            CreateAt = feedback.CreateAt;
            UserName = feedback.User?.Userinfo?.FullName;
            Avatar = feedback.User?.Userinfo?.AvatarUrl;
        }

        public Feedback ToFeedback()
        {
            return new Feedback
            {
                Id = this.Id,
                UserId = this.UserId,
                ProductId = this.ProductId,
                OrderId = this.OrderId,
                Rating = this.Rating,
                Comment = this.Comment,
                CreateAt = this.CreateAt
            };
        }
    }
}
