using ClothingShop_BE.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace TestProject_ClothingShop
{
    public class CustomWebApplicationFactory<TStartup>
     : WebApplicationFactory<TStartup> where TStartup : class
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove real DbContext
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ClothingShopPrn232G5Context>));
                if (descriptor != null) services.Remove(descriptor);
                // Use InMemory DB for test
                services.AddDbContext<ClothingShopPrn232G5Context>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });

                // Build provider and seed test data
                var sp = services.BuildServiceProvider();
                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ClothingShopPrn232G5Context>();
                    db.Database.EnsureCreated();
                    db.Products.AddRange(
                        new Product { Id = 1, Name = "Test Product", Price = 100 },
                        new Product { Id = 2, Name = "Another Product", Price = 200 }
                    );
                    db.ProductStatuses.AddRange(
                        new ProductStatus { Id = 1, Name = "Test" },
                        new ProductStatus { Id = 2, Name = "Test" }
                    );
                    db.Categories.AddRange(
                        new Category { Id = 1, Name = "Test" },
                        new Category { Id = 2, Name = "Test" }
                        );

                    db.SaveChanges();
                }
            });
        }
    }
}
