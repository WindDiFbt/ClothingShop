# Seller Analytics - Hướng dẫn sử dụng

## Tổng quan
Seller Analytics là trang thống kê dành cho Admin Business để theo dõi hiệu suất của các seller trong hệ thống.

## Tính năng chính

### 1. Thông tin cơ bản về Seller
- **Tổng số seller đang hoạt động**: Hiển thị số lượng seller có trạng thái active
- **Số seller mới trong tháng/năm**: Thống kê seller đăng ký mới theo thời gian
- **Tỷ lệ tăng trưởng**: So sánh với kỳ trước để tính toán tốc độ tăng trưởng

### 2. Top Seller theo doanh thu
- Hiển thị top 10 seller có doanh thu cao nhất
- Thông tin chi tiết: tên, email, doanh thu, số đơn hàng, số sản phẩm, tỷ lệ hoàn thành

### 3. Phân bố doanh thu theo Seller
- Biểu đồ tròn thể hiện tỷ lệ đóng góp doanh thu của từng seller
- Hiển thị phần trăm doanh thu của mỗi seller

### 4. Thống kê đơn hàng theo Seller
- Tổng số đơn hàng của mỗi seller
- Phân loại theo trạng thái: đã hoàn thành, đang xử lý, đã hủy
- Tỷ lệ hoàn thành đơn hàng
- Doanh thu và giá trị đơn hàng trung bình

### 5. Top sản phẩm bán chạy của từng Seller
- Hiển thị top 5 sản phẩm bán chạy nhất của mỗi seller
- Thông tin: tên sản phẩm, danh mục, số lượng đã bán, doanh thu

## Cách sử dụng

### Lọc theo thời gian
1. Sử dụng các nút nhanh: 7 ngày, 30 ngày, 90 ngày
2. Hoặc chọn khoảng thời gian tùy chỉnh bằng cách nhập ngày bắt đầu và kết thúc

### Xem biểu đồ
- **Biểu đồ tròn**: Phân bố doanh thu theo seller
- **Biểu đồ cột ngang**: Top seller theo doanh thu

### Xem bảng thống kê
- **Bảng Top Seller**: Xem chi tiết top 10 seller
- **Bảng Order Statistics**: Thống kê đơn hàng theo từng seller
- **Bảng Top Products**: Sản phẩm bán chạy của từng seller

## API Endpoints

### Backend
- `GET /api/admin/analytics/seller-analytics` - Lấy dữ liệu thống kê seller

### Frontend
- Redux Slice: `src/redux/slices/admin/SellerAnalyticsSlice.js`
- Service: `src/services/admin/AnalyticsService.js`
- Component: `src/pages/admin_business/sellers/SellerAnalytics.jsx`

## Cấu trúc dữ liệu

### SellerAnalyticsDTO
```csharp
public class SellerAnalyticsDTO
{
    // Basic Seller Statistics
    public int TotalActiveSellers { get; set; }
    public int NewSellersThisMonth { get; set; }
    public int NewSellersThisYear { get; set; }
    public double SellerGrowthRate { get; set; }
    
    // Top Sellers by Revenue
    public List<TopSellerDTO> TopSellersByRevenue { get; set; }
    
    // Revenue Distribution
    public List<SellerRevenueDTO> SellerRevenueDistribution { get; set; }
    
    // Top Products by Seller
    public List<SellerTopProductsDTO> SellerTopProducts { get; set; }
    
    // Order Completion Rates
    public List<SellerOrderStatsDTO> SellerOrderStats { get; set; }
}
```

## Lưu ý
- Dữ liệu được tính toán dựa trên đơn hàng có trạng thái "DELIVERED" (Status = 4)
- Tỷ lệ hoàn thành được tính: (Đơn hàng hoàn thành / Tổng đơn hàng) * 100
- Tỷ lệ tăng trưởng được so sánh với kỳ trước cùng độ dài thời gian 