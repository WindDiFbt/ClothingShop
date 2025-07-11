using ClothingShop_BE.Models;
using ClothingShop_BE.ModelsDTO;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

namespace ClothingShop_BE.Configurations
{
    public static class OdataConfig
    {
        public static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Product>("Products");
            builder.EntitySet<Order>("Orders");
            return builder.GetEdmModel();
        }
    }
}
