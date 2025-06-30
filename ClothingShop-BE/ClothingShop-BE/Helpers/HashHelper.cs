using System.Security.Cryptography;
using System.Text;

namespace ClothingShop_BE.Helpers
{
    public class HashHelper
    {
        public static string ToSha256(string input)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hash = sha.ComputeHash(bytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
