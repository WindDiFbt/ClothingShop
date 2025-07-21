using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Models;
using ClothingShop_BE.Repository;
using ClothingShop_BE.Repository.Impl;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Service.Impl
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IFeedbackRepository _feedbackRepository;

        public OrderService(IOrderRepository orderRepository, ICartRepository cartRepository, IFeedbackRepository feedbackRepository)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _feedbackRepository = feedbackRepository;
        }

        public async Task<CheckoutResponseDTO> CreateOrderAsync(CheckoutRequestDTO request, Guid userId)
        {
            // Validate checkout request
            if (!await ValidateCheckoutAsync(request))
            {
                return new CheckoutResponseDTO
                {
                    Success = false,
                    Message = "Validation failed. Please check your cart items.",
                    OrderId = null
                };
            }

            try
            {
                // Get cart items
                var cart = await _cartRepository.GetCartByUserIdAsync(userId);
                if (cart == null || cart.CartDetails == null || !cart.CartDetails.Any())
                {
                    return new CheckoutResponseDTO
                    {
                        Success = false,
                        Message = "Cart is empty",
                        OrderId = null
                    };
                }

                var cartItems = cart.CartDetails;

                // Check stock availability for all items
                foreach (var item in cartItems)
                {
                    if (!await _orderRepository.CheckStockAvailabilityAsync(item.ProductId, item.Quantity ?? 0))
                    {
                        return new CheckoutResponseDTO
                        {
                            Success = false,
                            Message = $"Insufficient stock for product {item.Product?.Name}",
                            OrderId = null
                        };
                    }
                }

                // Calculate total amount
                int totalAmount = cartItems.Sum(item => (item.Product?.Price ?? 0) * (item.Quantity ?? 0));

                // Create order
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    CustomerId = userId,
                    CreateAt = DateTime.UtcNow,
                    UpdateAt = DateTime.UtcNow,
                    OrderDate = DateTime.UtcNow,
                    Status = 1, // Pending
                    TotalAmount = totalAmount,
                    FullName = request.CustomerName,
                    PhoneNumber = request.CustomerPhone,
                    Address = request.ShippingAddress,
                    Note = request.Note
                };

                // Create order details
                var orderDetails = cartItems.Select(item => new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Product?.Price,
                    TotalPrice = (item.Product?.Price ?? 0) * (item.Quantity ?? 0),
                    Status = 1 // Active
                }).ToList();

                order.OrderDetails = orderDetails;

                // Reduce stock for each product
                foreach (var item in cartItems)
                {
                    await _orderRepository.ReduceProductStockAsync(item.ProductId, item.Quantity ?? 0);
                }

                // Save order
                var createdOrder = await _orderRepository.CreateOrderAsync(order);

                // Clear user's cart
                await _cartRepository.ClearCartAsync(userId);

                return new CheckoutResponseDTO
                {
                    Success = true,
                    Message = "Order created successfully",
                    OrderId = createdOrder.Id
                };
            }
            catch (Exception ex)
            {
                return new CheckoutResponseDTO
                {
                    Success = false,
                    Message = $"An error occurred while creating the order: {ex.Message}",
                    OrderId = null
                };
            }
        }

        public async Task<OrderDTO?> GetOrderByIdAsync(Guid orderId, Guid userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.CustomerId != userId)
                return null;

            return new OrderDTO(order);
        }

        public async Task<List<OrderDTO>> GetUserOrdersAsync(Guid userId)
        {
            var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);

            var orderDTOs = new List<OrderDTO>();

            foreach (var order in orders)
            {
                var orderDTO = new OrderDTO(order);

                // For each order detail, check if feedback exists and populate it
                foreach (var orderDetailDTO in orderDTO.OrderDetails)
                {
                    if (orderDetailDTO.ProductId.HasValue)
                    {
                        // Check if feedback exists for this order detail
                        var feedback = await _feedbackRepository.GetFeedbackByOrderAndProductAsync(order.Id, orderDetailDTO.ProductId.Value);

                        if (feedback != null)
                        {
                            orderDetailDTO.Feedback = new ModelsDTO.FeedbackDTO(feedback);
                            orderDetailDTO.HasFeedback = true;
                        }
                        else
                        {
                            orderDetailDTO.HasFeedback = false;
                        }
                    }
                }

                orderDTOs.Add(orderDTO);
            }

            return orderDTOs;
        }

        public async Task<OrderDTO?> UpdateOrderStatusAsync(Guid orderId, int status)
        {
            var order = await _orderRepository.UpdateOrderStatusAsync(orderId, status);
            if (order == null) return null;

            return new OrderDTO(order);
        }

        public async Task<bool> CancelOrderAsync(Guid orderId, Guid userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.CustomerId != userId || order.Status != 1) // Only pending orders can be cancelled
                return false;

            // Restore stock for each product
            foreach (var detail in order.OrderDetails ?? Enumerable.Empty<OrderDetail>())
            {
                await _orderRepository.RestoreProductStockAsync(detail.ProductId ?? 0, detail.Quantity ?? 0);
            }

            // Update order status to cancelled (assuming status 6 = cancelled)
            await _orderRepository.UpdateOrderStatusAsync(orderId, 6);
            return true;
        }

        public Task<bool> ValidateCheckoutAsync(CheckoutRequestDTO request)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(request.CustomerName) ||
                string.IsNullOrWhiteSpace(request.CustomerPhone) ||
                string.IsNullOrWhiteSpace(request.ShippingAddress) ||
                string.IsNullOrWhiteSpace(request.PaymentMethod))
            {
                return Task.FromResult(false);
            }

            // For now, we'll return true for basic validation
            // Additional business logic can be added here
            return Task.FromResult(true);
        }
        public IQueryable<Order> GetAllOrdersODATA()
        {
            return _orderRepository.GetAllOrdersForODATA();
        }
        public async Task<(List<OrderDTO> orders, int currentPage, int totalPages)> GetOrdersAsync(Guid sellerId,int page, int pageSize)
        {
            var (totalItems, orders) = await _orderRepository.GetOrdersPagedAsync( sellerId, page, pageSize);

            var orderDTOs = orders.Select(o => new OrderDTO(o)).ToList();
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            return (orderDTOs, page, totalPages);
        }
        public async Task<OrderDTO?> GetOrderDetailByIdAsync(Guid orderId)
        {
            var order = await _orderRepository.GetOrderDetailWithIncludesAsync(orderId);
            if (order == null) return null;
            return new OrderDTO(order);
        }

        public async Task<bool> UpdateOrderStatusSellerAsync(Guid orderId, int newStatus)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null) return false;

            order.Status = newStatus;
            order.UpdateAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);
            return true;
        }

        public IQueryable<Order> GetAllOrdersOData()
        {
            return _orderRepository.GetAllOrders();
        }
    }
}
