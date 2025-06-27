using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public CategoryRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategoriesAsync() =>
            await _context.Categories.ToListAsync();

    }
}
