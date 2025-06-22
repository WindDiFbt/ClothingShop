using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class ProductStatusRepository : IProductStatusRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public ProductStatusRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<List<ProductStatus>> GetAllProductStatusAsync() =>
            await _context.ProductStatuses.ToListAsync();
    }
}
