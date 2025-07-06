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

        public async Task<List<Feedback>> Get3FeedbackNewestAsync(long ProductId) =>
            await _context.Feedbacks
                .Where(f => f.ProductId == ProductId)
                .Include(f => f.User)
                .ThenInclude(f => f.Userinfo)
                .OrderByDescending(f => f.CreateAt)
                .Take(3)
                .ToListAsync();

        public async Task<List<Feedback>> GetAllFeedbackAsync(long productId) =>
            await _context.Feedbacks
                .Where(f => f.ProductId == productId)
                .Include(f => f.Product)
                .Include(f => f.User)
                .Include(f => f.User.Userinfo)
                .ToListAsync();

        public async Task<bool> HasFeedbackExistAsync(long productId, Guid orderId) =>
            await _context.Feedbacks.AnyAsync(f => f.OrderId == orderId && f.ProductId == productId);

        public async Task<Feedback?> GetFeedbackByOrderAndProductAsync(Guid orderId, long productId) =>
            await _context.Feedbacks
                .Include(f => f.User)
                .ThenInclude(u => u.Userinfo)
                .Include(f => f.Product)
                .FirstOrDefaultAsync(f => f.OrderId == orderId && f.ProductId == productId);

        public async Task<Feedback> SaveFeedback(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }
    }
}
