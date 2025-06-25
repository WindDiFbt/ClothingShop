using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class OrderDTO
    {
        public Guid Id { get; set; }
        public Guid? CustomerId { get; set; }
        public long? VoucherId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? Status { get; set; }
        public string? PaymentLink { get; set; }
        public int? TotalAmount { get; set; }
        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }

        public OrderDTO() { }

        public OrderDTO(Order order)
        {
            Id = order.Id;
            CustomerId = order.CustomerId;
            VoucherId = order.VoucherId;
            FullName = order.FullName;
            PhoneNumber = order.PhoneNumber;
            Address = order.Address;
            Note = order.Note;
            OrderDate = order.OrderDate;
            Status = order.Status;
            PaymentLink = order.PaymentLink;
            TotalAmount = order.TotalAmount;
            CreateAt = order.CreateAt;
            UpdateAt = order.UpdateAt;
        }

        public Order ToOrder()
        {
            return new Order
            {
                Id = this.Id,
                CustomerId = this.CustomerId,
                VoucherId = this.VoucherId,
                FullName = this.FullName,
                PhoneNumber = this.PhoneNumber,
                Address = this.Address,
                Note = this.Note,
                OrderDate = this.OrderDate,
                Status = this.Status,
                PaymentLink = this.PaymentLink,
                TotalAmount = this.TotalAmount,
                CreateAt = this.CreateAt,
                UpdateAt = this.UpdateAt
            };
        }
    }
}
