using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using System.Net.Http.Json;


namespace TestProject_ClothingShop.Integration
{
    public class ProductsIntegrationTest : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ProductsIntegrationTest(CustomWebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetCategories_ShouldReturnOkAndNonEmptyList()
        {
            var response = await _client.GetAsync("/api/products/categories");
            response.EnsureSuccessStatusCode();

            var categories = await response.Content.ReadFromJsonAsync<List<CategoryDTO>>();
            Assert.NotNull(categories);
            Assert.NotEmpty(categories);
        }

        [Fact]
        public async Task GetProductStatuses_ShouldReturnOkAndNonEmptyList()
        {
            var response = await _client.GetAsync("/api/products/status");
            response.EnsureSuccessStatusCode();

            var statuses = await response.Content.ReadFromJsonAsync<List<ProductStatusDTO>>();
            Assert.NotNull(statuses);
            Assert.NotEmpty(statuses);
        }
    }
}
