using Moq;
using ClothingShop_BE.Controllers;
using ClothingShop_BE.Service;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;


namespace TestProject_ClothingShop.Controllers
{
    public class ProductsControllerTest
    {
        private readonly Mock<IProductService> _mockProductService;
        private readonly ProductsController _controller;

        public ProductsControllerTest()
        {
            _mockProductService = new Mock<IProductService>();
            _controller = new ProductsController(_mockProductService.Object);
        }

        [Fact]
        public void Get_ShouldReturnQueryableProducts()
        {
            // Arrange
            var data = new List<Product>
            {
                new Product { Id = 1, Name = "Product A" },
                new Product { Id = 2, Name = "Product B" }
            }.AsQueryable();

            _mockProductService.Setup(s => s.GetAllProductsODATA()).Returns(data);

            // Act
            var result = _controller.Get();

            // Assert
            result.Should().BeEquivalentTo(data);
        }

        [Fact]
        public async Task GetProduct_ShouldReturnOkWithProductDetail()
        {
            // Arrange
            var productDto = new ProductDTO
            {
                Id = 1,
                Name = "Test Product",
                Images = new List<string> { "img1.jpg" },
                ProductVariants = new List<ProductVariantDTO>
                {
                    new ProductVariantDTO { Id = 101, Size = "Size M" }
                }
            };
            var seller = new
            {
                Id = Guid.NewGuid(),
                AvatarUrl = "avatar.jpg",
                Username = "seller123",
                FullName = "John Doe"
            };
            var relatedProducts = new List<ProductDTO>
            {
                new ProductDTO { Id = 2, Name = "Related 1" },
                new ProductDTO { Id = 3, Name = "Related 2" }
            };
            var feedbacks = new List<FeedbackDTO>
            {
                new FeedbackDTO { Id = 1, Comment = "Great!" },
                new FeedbackDTO { Id = 2, Comment = "Nice quality!" }
            };

            _mockProductService
                .Setup(x => x.GetDetailProductsAsync(1))
                .ReturnsAsync((productDto, seller, relatedProducts, feedbacks));

            // Act
            var result = await _controller.GetProduct(1);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();

            var json = JsonConvert.SerializeObject(okResult.Value);
            var dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            // Test Product
            var actualProduct = JsonConvert.DeserializeObject<ProductDTO>(dict["productDto"].ToString());
            actualProduct.Should().BeEquivalentTo(productDto);

            // Test Seller
            var actualSeller = JsonConvert.DeserializeObject<Dictionary<string, object>>(dict["seller"].ToString());
            actualSeller["Id"].ToString().Should().Be(seller.Id.ToString());
            actualSeller["AvatarUrl"].ToString().Should().Be(seller.AvatarUrl);
            actualSeller["Username"].ToString().Should().Be(seller.Username);
            actualSeller["FullName"].ToString().Should().Be(seller.FullName);

            // Test Related Products
            var actualRelated = JsonConvert.DeserializeObject<List<ProductDTO>>(dict["relatedProducts"].ToString());
            actualRelated.Should().BeEquivalentTo(relatedProducts);

            // Test Feedbacks
            var actualFeedbacks = JsonConvert.DeserializeObject<List<FeedbackDTO>>(dict["feedbacks"].ToString());
            actualFeedbacks.Should().BeEquivalentTo(feedbacks);
        }

        [Fact]
        public async Task GetCategories_ShouldReturnOkWithCategories()
        {
            // Arrange
            var categories = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 1, Name = "Category A" },
                new CategoryDTO { Id = 2, Name = "Category B" }
            };

            _mockProductService
                .Setup(s => s.GetCategoriesAsync())
                .ReturnsAsync(categories);

            // Act
            var result = await _controller.GetCategories();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.StatusCode.Should().Be(200);

            var actual = okResult.Value as List<CategoryDTO>;
            actual.Should().BeEquivalentTo(categories);
        }

        [Fact]
        public async Task GetProductStatuses_ShouldReturnOkWithStatuses()
        {
            // Arrange
            var statuses = new List<ProductStatusDTO>
            {
                new ProductStatusDTO { Id = 1, Name = "Available" },
                new ProductStatusDTO { Id = 2, Name= "Out of Stock" }
            };

            _mockProductService
                .Setup(s => s.GetProductStatusesAsync())
                .ReturnsAsync(statuses);

            // Act
            var result = await _controller.GetProductStatuses();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.StatusCode.Should().Be(200);

            var actual = okResult.Value as List<ProductStatusDTO>;
            actual.Should().BeEquivalentTo(statuses);
        }

        [Fact]
        public async Task CreateProduct_ValidModel_ShouldReturnOkWithCreatedProduct()
        {
            // Arrange
            var inputDto = new ProductDTO { Name = "Test Product", Price = 100 };
            var createdDto = new ProductDTO { Id = 1, Name = "Test Product", Price = 100 };

            _mockProductService
                .Setup(s => s.CreateProductAsync(inputDto))
                .ReturnsAsync(createdDto);

            // Act
            var result = await _controller.CreateProduct(inputDto);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.StatusCode.Should().Be(200);

            var actualProduct = okResult.Value as ProductDTO;
            actualProduct.Should().BeEquivalentTo(createdDto);
        }

        [Fact]
        public async Task CreateProduct_InvalidModel_ShouldReturnBadRequest()
        {
            // Arrange
            var inputDto = new ProductDTO();

            _controller.ModelState.AddModelError("Name", "Name is required");

            // Act
            var result = await _controller.CreateProduct(inputDto);

            // Assert
            var badRequest = result as BadRequestObjectResult;
            badRequest.Should().NotBeNull();
            badRequest.StatusCode.Should().Be(400);

            var modelState = badRequest.Value as SerializableError;
            modelState.Should().ContainKey("Name");
        }

        [Fact]
        public async Task UpdateProduct_ValidIdAndDto_ShouldReturnOkWithUpdatedProduct()
        {
            // Arrange
            long productId = 1;
            var inputDto = new ProductDTO { Id = productId, Name = "Updated", Price = 150 };
            var updatedDto = new ProductDTO { Id = productId, Name = "Updated", Price = 150 };

            _mockProductService
                .Setup(s => s.UpdateProductAsync(productId, inputDto))
                .ReturnsAsync(updatedDto);

            // Act
            var result = await _controller.UpdateProduct(productId, inputDto);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult.StatusCode.Should().Be(200);

            var value = okResult.Value as ProductDTO;
            value.Should().BeEquivalentTo(updatedDto);
        }

    }
}
