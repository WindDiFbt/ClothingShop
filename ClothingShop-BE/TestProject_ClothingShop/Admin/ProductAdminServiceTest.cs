using Xunit;
using ClothingShop_BE.Services.Admin.Products;
using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;

namespace TestProject_ClothingShop.Admin
{
    public class ProductAdminServiceTest
    {
        private ClothingShopPrn232G5Context GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ClothingShopPrn232G5Context>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new ClothingShopPrn232G5Context(options);
        }

        [Fact]
        public async Task GetPendingProductsAsync_ReturnsPendingProducts()
        {
            using var context = GetInMemoryContext();
            var status = new ProductStatus { Id = 2, Name = "Pending" };
            var category = new Category { Id = 1, Name = "Cat1" };
            var seller = new User { Id = Guid.NewGuid(), Userinfo = new Userinfo { FullName = "Seller1" }, Email = "seller@email.com" };
            context.ProductStatuses.Add(status);
            context.Categories.Add(category);
            context.Users.Add(seller);
            context.Products.Add(new Product { Id = 1, Status = 2, Category = category, Seller = seller, Images = new List<Image>(), StatusNavigation = status, ProductVariants = new List<ProductVariant>() });
            context.SaveChanges();
            var service = new ProductAdminService(context);
            var result = await service.GetPendingProductsAsync();
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(2, result[0].Status);
            Assert.Equal("Pending", result[0].StatusName);
        }

        [Fact]
        public async Task ApproveProductAsync_ValidId_ApprovesProduct()
        {
            using var context = GetInMemoryContext();
            context.Products.Add(new Product { Id = 1, Status = 2 });
            context.SaveChanges();
            var service = new ProductAdminService(context);
            var result = await service.ApproveProductAsync(1);
            Assert.True(result);
            var updated = await context.Products.FindAsync(1L);
            Assert.Equal(1, updated.Status); // 1 = Approved
        }

        [Fact]
        public async Task RejectProductAsync_ValidId_RejectsProduct()
        {
            using var context = GetInMemoryContext();
            context.Products.Add(new Product { Id = 1, Status = 2, Seller = new User() });
            context.SaveChanges();
            var service = new ProductAdminService(context);
            var result = await service.RejectProductAsync(1, "reason");
            Assert.True(result);
            var updated = await context.Products.FindAsync(1L);
            Assert.Equal(3, updated.Status); // 3 = Rejected
            Assert.Single(context.ProductRejectionLogs);
            Assert.Equal("reason", context.ProductRejectionLogs.First().Reason);
        }

        [Fact]
        public async Task GetAllProductsAsync_ReturnsAllProducts()
        {
            using var context = GetInMemoryContext();
            var status1 = new ProductStatus { Id = 1, Name = "Approved" };
            var status2 = new ProductStatus { Id = 2, Name = "Pending" };
            var category1 = new Category { Id = 1, Name = "Cat1" };
            var category2 = new Category { Id = 2, Name = "Cat2" };
            var seller1 = new User { Id = Guid.NewGuid(), Userinfo = new Userinfo { FullName = "Seller1" }, Email = "seller@email.com" };
            var seller2 = new User { Id = Guid.NewGuid(), Userinfo = new Userinfo { FullName = "Seller2" }, Email = "seller2@email.com" };
            context.ProductStatuses.AddRange(status1, status2);
            context.Categories.AddRange(category1, category2);
            context.Users.AddRange(seller1, seller2);
            context.Products.Add(new Product { Id = 1, Status = 1, Category = category1, Seller = seller1, Images = new List<Image>(), StatusNavigation = status1, ProductVariants = new List<ProductVariant>() });
            context.Products.Add(new Product { Id = 2, Status = 2, Category = category2, Seller = seller2, Images = new List<Image>(), StatusNavigation = status2, ProductVariants = new List<ProductVariant>() });
            context.SaveChanges();
            var service = new ProductAdminService(context);
            var result = await service.GetAllProductsAsync();
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.Status == 1 && p.StatusName == "Approved");
            Assert.Contains(result, p => p.Status == 2 && p.StatusName == "Pending");
        }

        [Fact]
        public async Task GetAdminProductDetailAsync_ValidId_ReturnsDetail()
        {
            using var context = GetInMemoryContext();
            var status = new ProductStatus { Id = 1, Name = "Approved" };
            var category = new Category { Id = 1, Name = "Cat1" };
            var seller = new User { Id = Guid.NewGuid(), Userinfo = new Userinfo { FullName = "Seller1" }, Email = "seller@email.com" };
            context.ProductStatuses.Add(status);
            context.Categories.Add(category);
            context.Users.Add(seller);
            context.Products.Add(new Product {
                Id = 1,
                Name = "Product1",
                Status = 1,
                Category = category,
                Seller = seller,
                Images = new List<Image>(),
                StatusNavigation = status,
                ProductVariants = new List<ProductVariant>(),
                ProductRejectionLogs = new List<ProductRejectionLog>()
            });
            context.SaveChanges();
            var service = new ProductAdminService(context);
            var result = await service.GetAdminProductDetailAsync(1);
            Assert.NotNull(result);
            Assert.Equal("Product1", result.Name);
            Assert.Equal("Cat1", result.CategoryName);
            Assert.Equal("Seller1", result.SellerName);
            Assert.Equal("Approved", result.StatusName);
        }
    }
} 