using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class ProductStatusDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public ProductStatusDTO() { }

        public ProductStatusDTO(ProductStatus status)
        {
            Id = status.Id;
            Name = status.Name;
        }
    }
}
