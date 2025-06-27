using ClothingShop_BE.Models;

namespace ClothingShop_BE.Repository
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllCategoriesAsync();
    }
}
