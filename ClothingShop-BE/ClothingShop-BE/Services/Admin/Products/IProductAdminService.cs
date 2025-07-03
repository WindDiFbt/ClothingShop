using ClothingShop_BE.ModelsDTO.Admin.AuthorizeProduct;

namespace ClothingShop_BE.Services.Admin.Products
{
    public interface IProductAdminService
    {
        Task<List<PendingProductDTO>> GetPendingProductsAsync();
        Task<bool> ApproveProductAsync(long id);
        Task<bool> RejectProductAsync(long id, string rejectReason);
        Task<List<PendingProductDTO>> GetAllProductsAsync();
    }
}
