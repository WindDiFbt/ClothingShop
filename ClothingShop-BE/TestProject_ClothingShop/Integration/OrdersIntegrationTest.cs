using ClothingShop_BE.ModelsDTO;
using System.Net;
using System.Net.Http.Json;

namespace TestProject_ClothingShop.Integration
{
    public class OrdersIntegrationTest : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public OrdersIntegrationTest(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetOrdersPagination_ShouldReturnOk()
        {
            var response = await _client.GetAsync("/api/order/pagination?page=1&pageSize=8");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var content = await response.Content.ReadAsStringAsync();
            Assert.False(string.IsNullOrEmpty(content));
        }

        [Fact]
        public async Task GetOrderDetail_ShouldReturnNotFound_WhenOrderDoesNotExist()
        {
            var fakeOrderId = Guid.NewGuid();

            var response = await _client.GetAsync($"/api/order/{fakeOrderId}");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateStatus_ShouldReturnNotFound_WhenOrderDoesNotExist()
        {
            var fakeOrderId = Guid.NewGuid();
            int newStatus = 1;

            var response = await _client.PutAsJsonAsync($"/api/order/{fakeOrderId}/status", newStatus);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CancelOrder_ShouldReturnBadRequest_WhenUserIdInvalid()
        {
            var fakeOrderId = Guid.NewGuid();

            var response = await _client.PutAsync($"/api/order/{fakeOrderId}/cancel", null);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
