namespace ClothingShop_BE.ModelsDTO;

public class FeedbackResponseDTO
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public long ProductId { get; set; }
    public Guid OrderId { get; set; }
    public byte Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreateAt { get; set; }
    public string UserName { get; set; } = string.Empty;
}
