using ClothingShop_BE.Controllers;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.Service;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;

namespace TestProject_ClothingShop.Controllers
{
    public class OrderControllerTest
    {
        private readonly Mock<IOrderService> _mockOrderService;
        private readonly OrderController _controller;

        public OrderControllerTest()
        {
            _mockOrderService = new Mock<IOrderService>();
            _controller = new OrderController(_mockOrderService.Object);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
            }, "mock"));

        }

        [Fact]
        public async Task GetOrdersPagination_ShouldReturnOk()
        {
            var orders = new List<OrderDTO> { new OrderDTO { Id = Guid.NewGuid() } };
            _mockOrderService.Setup(s => s.GetOrdersAsync( 1, 8))
                             .ReturnsAsync((orders, 1, 1));

            var result = await _controller.GetOrdersPagination();

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetOrderDetail_ShouldReturnOk_WhenOrderExists()
        {
            var orderId = Guid.NewGuid();
            var order = new OrderDTO { Id = orderId };
            _mockOrderService.Setup(s => s.GetOrderDetailByIdAsync(orderId)).ReturnsAsync(order);

            var result = await _controller.GetOrderDetail(orderId);

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.Value.Should().BeEquivalentTo(order);
        }

        [Fact]
        public async Task GetOrderDetail_ShouldReturnNotFound_WhenOrderNotExists()
        {
            var orderId = Guid.NewGuid();
            _mockOrderService.Setup(s => s.GetOrderDetailByIdAsync(orderId)).ReturnsAsync((OrderDTO?)null);

            var result = await _controller.GetOrderDetail(orderId);

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdateStatus_ShouldReturnNoContent_WhenUpdateSuccess()
        {
            var orderId = Guid.NewGuid();
            _mockOrderService.Setup(s => s.UpdateOrderStatusSellerAsync(orderId, 1)).ReturnsAsync(true);

            var result = await _controller.UpdateStatus(orderId, 1);

            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task UpdateStatus_ShouldReturnNotFound_WhenOrderNotExists()
        {
            var orderId = Guid.NewGuid();
            _mockOrderService.Setup(s => s.UpdateOrderStatusSellerAsync(orderId, 1)).ReturnsAsync(false);

            var result = await _controller.UpdateStatus(orderId, 1);

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task CancelOrder_ShouldReturnOk_WhenSuccess()
        {
            var orderId = Guid.NewGuid();
            _mockOrderService.Setup(s => s.CancelOrderAsync(orderId, It.IsAny<Guid>())).ReturnsAsync(true);

            var result = await _controller.CancelOrder(orderId);

            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.Value.Should().NotBeNull();
        }

        [Fact]
        public async Task CancelOrder_ShouldReturnBadRequest_WhenFails()
        {
            var orderId = Guid.NewGuid();
            _mockOrderService.Setup(s => s.CancelOrderAsync(orderId, It.IsAny<Guid>())).ReturnsAsync(false);

            var result = await _controller.CancelOrder(orderId);

            var badRequest = result as BadRequestObjectResult;
            badRequest.Should().NotBeNull();
        }
    }
}
