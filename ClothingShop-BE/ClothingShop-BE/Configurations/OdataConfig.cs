using ClothingShop_BE.Models;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace ClothingShop_BE.Configurations
{
    public static class OdataConfig
    {
        public static IEdmModel GetEdmModel(this IServiceCollection services)
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Product>("Products");
            return builder.GetEdmModel();
        }
    }
}
