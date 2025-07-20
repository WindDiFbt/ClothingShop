using Microsoft.AspNetCore.Identity.Data;
using ClothingShop_BE.AuthModels;
using ClothingShop_BE.RequestModels;
namespace ClothingShop_BE.Service
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestForm request);
        Task<LoginResponseForm?> LoginAsync(LoginRequestForm request);

    }
}
