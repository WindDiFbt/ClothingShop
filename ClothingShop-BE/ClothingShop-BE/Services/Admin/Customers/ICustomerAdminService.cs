using ClothingShop_BE.ModelsDTO.Admin;

namespace ClothingShop_BE.Services.Admin.Customers
{
    public interface ICustomerAdminService
    {
        Task<CustomerListResultDTO> GetAllCustomersAsync(string? searchTerm, string? statusFilter, int page, int pageSize);
        Task<CustomerDetailDTO?> GetCustomerDetailAsync(Guid customerId);
        Task<bool> UpdateCustomerStatusAsync(Guid customerId, int newStatus);
        Task<List<CustomerOrderDTO>> GetCustomerOrdersAsync(Guid customerId);
        Task<CustomerStatisticsDTO> GetCustomerStatisticsAsync();
    }

    public class CustomerListResultDTO
    {
        public List<CustomerAdminDTO> Customers { get; set; } = new List<CustomerAdminDTO>();
        public int TotalCount { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
    }
}
