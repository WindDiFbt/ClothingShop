using ClothingShop_BE.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Repository.Impl
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly ClothingShopPrn232G5Context _context;

        public FeedbackRepository(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Feedback>> Get3FeedbackAsync(long ProductId) =>
            await _context.Feedbacks
                .Where(f => f.ProductId == ProductId)
                .Include(f => f.User)
                .ThenInclude(f => f.Userinfo)
                .OrderByDescending(f => f.CreateAt)
                .Take(3)
                .ToListAsync();
    }
}
