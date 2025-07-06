namespace ClothingShop_BE.ModelsDTO;

public class FeedbackCreateDTO
{
    public long ProductId { get; set; }
    public Guid OrderId { get; set; }
    public byte Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
