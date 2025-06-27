using System.Security.Claims;

namespace ClothingShop_BE.Service
{
    public interface IJwtService
    {
        string GenerateToken(string userId, string email, List<string> roles = null);
        ClaimsPrincipal ValidateToken(string token);
    }
}
