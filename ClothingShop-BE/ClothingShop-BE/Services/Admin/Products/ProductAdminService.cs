using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct;
using Microsoft.EntityFrameworkCore;

namespace ClothingShop_BE.Services.Admin.Products
{
    public class ProductAdminService : IProductAdminService
    {
        private readonly ClothingShopPrn232G5Context _context;

        public ProductAdminService(ClothingShopPrn232G5Context context)
        {
            _context = context;
        }

        public async Task<List<PendingProductDTO>> GetPendingProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                    .ThenInclude(s => s.Userinfo)
                .Include(p => p.Images)
                .Include(p => p.StatusNavigation)
                .Where(p => p.Status == 2)
                .Select(p => new PendingProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Discount = p.Discount,
                    Status = p.Status,
                    StatusName = p.StatusNavigation.Name,
                    CreatedAt = p.CreateAt,
                    CategoryId = p.Category.Id,
                    CategoryName = p.Category.Name,
                    SellerId = p.Seller.Id,
                    SellerName = p.Seller.Userinfo.FullName,
                    SellerEmail = p.Seller.Email,
                    ProductVariants = p.ProductVariants.Select(v => new ProductVariantDTO
                    {
                        Id = v.Id,
                        ProductId = v.ProductId,
                        Size = v.Size,
                        Quantity = v.Quantity
                    }).ToList(),
                    ImageUrls = p.Images.Select(i => i.Url).ToList()
                })
                .ToListAsync();
        }

        public async Task<bool> ApproveProductAsync(long id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null || product.Status != 2)
                return false;

            product.Status = 1; // Approved
            product.UpdateAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectProductAsync(long id, string rejectReason)
        {
            var product = await _context.Products
                .Include(p => p.Seller)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null || product.Status != 2)
                return false;

            product.Status = 3; // Rejected
            product.UpdateAt = DateTime.Now;

            var rejectionLog = new ProductRejectionLog
            {
                ProductId = id,
                Reason = rejectReason,
                RejectedAt = DateTime.Now
            };
            _context.ProductRejectionLogs.Add(rejectionLog);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PendingProductDTO>> GetAllProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                    .ThenInclude(s => s.Userinfo)
                .Include(p => p.Images)
                .Include(p => p.StatusNavigation)
                .Select(p => new PendingProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Discount = p.Discount,
                    Status = p.Status,
                    StatusName = p.StatusNavigation.Name,
                    CreatedAt = p.CreateAt,
                    CategoryId = p.Category.Id,
                    CategoryName = p.Category.Name,
                    SellerId = p.Seller.Id,
                    SellerName = p.Seller.Userinfo.FullName,
                    SellerEmail = p.Seller.Email,
                    ProductVariants = p.ProductVariants.Select(v => new ProductVariantDTO
                    {
                        Id = v.Id,
                        ProductId = v.ProductId,
                        Size = v.Size,
                        Quantity = v.Quantity
                    }).ToList(),
                    ImageUrls = p.Images.Select(i => i.Url).ToList()
                })
                .ToListAsync();
        }

        public async Task<AdminProductDetailDTO?> GetAdminProductDetailAsync(long id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Seller)
                    .ThenInclude(s => s.Userinfo)
                .Include(p => p.Images)
                .Include(p => p.StatusNavigation)
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductRejectionLogs)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return null;

            var latestRejection = product.ProductRejectionLogs
                .OrderByDescending(r => r.RejectedAt)
                .FirstOrDefault();

            return new AdminProductDetailDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Discount = product.Discount,
                Status = product.Status,
                StatusName = product.StatusNavigation?.Name,
                CreatedAt = product.CreateAt,
                CategoryName = product.Category?.Name,
                SellerName = product.Seller?.Userinfo?.FullName,
                SellerEmail = product.Seller?.Email,
                ImageUrls = product.Images.Select(i => i.Url).ToList(),
                ProductVariants = product.ProductVariants.Select(v => new ProductVariantDTO
                {
                    Id = v.Id,
                    ProductId = v.ProductId,
                    Size = v.Size,
                    Quantity = v.Quantity
                }).ToList(),
                RejectionReason = latestRejection?.Reason,
                RejectedAt = latestRejection?.RejectedAt
            };
        }
    }
}
