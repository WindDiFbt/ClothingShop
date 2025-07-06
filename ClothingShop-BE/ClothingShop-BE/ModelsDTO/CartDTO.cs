using System.Linq;
using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class CartDTO
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public int? TotalAmount { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public List<CartDetailDTO> CartDetails { get; set; } = new();

        public CartDTO() {}

        public CartDTO(Cart cart)
        {
            Id = cart.Id;
            UserId = cart.UserId;
            TotalAmount = cart.TotalAmount;
            CreateAt = cart.CreateAt;
            UpdateAt = cart.UpdateAt;
            CartDetails = cart.CartDetails.Select(cd => new CartDetailDTO(cd)).ToList();
        }

        public Cart ToCart()
        {
            return new Cart
            {
                Id = this.Id,
                UserId = this.UserId,
                TotalAmount = this.TotalAmount,
                CreateAt = this.CreateAt,
                UpdateAt = this.UpdateAt,
                CartDetails = this.CartDetails.Select(d => d.ToCartDetail()).ToList()
            };
        }
    }
} 