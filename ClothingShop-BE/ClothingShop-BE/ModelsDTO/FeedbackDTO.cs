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

        // Thông tin người dùng (nếu cần hiển thị)
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
    }
}
