import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchSellerAnalytics } from '../../../redux/slices/admin/SellerAnalyticsSlice';
import SellerDateRangeFilter from '../../../components/admin/dashboard/SellerDateRangeFilter';
import './SellerAnalytics.css';

const SellerAnalytics = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.sellerAnalytics);

    useEffect(() => {
        // Load initial data with last 30 days
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        dispatch(fetchSellerAnalytics({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
    }, [dispatch]);

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Lỗi:</strong> {error}
                </div>
            </div>
        );
    }

    // Chart options for revenue distribution
    const revenueChartOptions = {
        chart: {
            type: 'pie',
            height: 350
        },
        labels: data?.sellerRevenueDistribution?.map(s => s.sellerName) || [],
        series: data?.sellerRevenueDistribution?.map(s => s.revenue) || [],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    // Chart options for top sellers
    const topSellersChartOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: data?.topSellersByRevenue?.map(s => s.sellerName) || [],
        },
        yaxis: {
            title: {
                text: 'Doanh thu (VNĐ)'
            }
        }
    };

    const topSellersSeries = [{
        name: 'Doanh thu',
        data: data?.topSellersByRevenue?.map(s => s.totalRevenue) || []
    }];

    return (
        <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
                <ul className="flex space-x-2">
                    <li>
                        <Link to="/admin-business" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] before:mr-2">
                        <span>Seller Analytics</span>
                    </li>
                </ul>
            </div>

            {/* Date Range Filter */}
            <SellerDateRangeFilter />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : data ? (
                <>
                    {/* Basic Statistics Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tổng Seller</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.totalActiveSellers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-green-100 text-green-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Seller mới tháng này</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.newSellersThisMonth}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tỷ lệ tăng trưởng</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.sellerGrowthRate > 0 ? '+' : ''}{data.sellerGrowthRate.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Seller mới năm nay</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.newSellersThisYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-2 mb-6">
                        {/* Revenue Distribution Chart */}
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố doanh thu theo Seller</h3>
                            {data.sellerRevenueDistribution && data.sellerRevenueDistribution.length > 0 ? (
                                <ReactApexChart 
                                    options={revenueChartOptions} 
                                    series={revenueChartOptions.series} 
                                    type="pie" 
                                    height={350} 
                                />
                            ) : (
                                <div className="flex justify-center items-center h-64 text-gray-500">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">📊</div>
                                        <div>Không có dữ liệu phân bố doanh thu</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top Sellers Chart */}
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Seller theo doanh thu</h3>
                            {data.topSellersByRevenue && data.topSellersByRevenue.length > 0 ? (
                                <ReactApexChart 
                                    options={topSellersChartOptions} 
                                    series={topSellersSeries} 
                                    type="bar" 
                                    height={350} 
                                />
                            ) : (
                                <div className="flex justify-center items-center h-64 text-gray-500">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🏆</div>
                                        <div>Không có dữ liệu top seller</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Sellers Table */}
                    <div className="rounded-lg bg-white p-4 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Seller theo doanh thu</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Doanh thu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đơn hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tỷ lệ hoàn thành
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.topSellersByRevenue?.map((seller, index) => (
                                        <tr key={seller.sellerId}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {seller.sellerName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {seller.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {seller.totalRevenue.toLocaleString()} đ
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {seller.totalOrders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {seller.totalProducts}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    seller.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                                                    seller.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {seller.completionRate.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Statistics Table */}
                    <div className="rounded-lg bg-white p-4 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đơn hàng theo Seller</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Seller
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng đơn hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đã hoàn thành
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đang xử lý
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đã hủy
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tỷ lệ hoàn thành
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Doanh thu
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.sellerOrderStats?.map((stat) => (
                                        <tr key={stat.sellerId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {stat.sellerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stat.totalOrders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="text-green-600 font-medium">{stat.completedOrders}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="text-yellow-600 font-medium">{stat.pendingOrders}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="text-red-600 font-medium">{stat.cancelledOrders}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    stat.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                                                    stat.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {stat.completionRate.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {stat.totalRevenue.toLocaleString()} đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products by Seller */}
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top sản phẩm bán chạy theo Seller</h3>
                        {data.sellerTopProducts?.map((seller) => (
                            <div key={seller.sellerId} className="mb-6 border-b border-gray-200 pb-4">
                                <h4 className="text-md font-medium text-gray-900 mb-3">{seller.sellerName}</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Danh mục
                                                </th>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Đã bán
                                                </th>
                                                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Doanh thu
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {seller.topProducts?.map((product) => (
                                                <tr key={product.productId}>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.productName}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {product.categoryName}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                        {product.totalSold}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.totalRevenue.toLocaleString()} đ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                    <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div>Không có dữ liệu thống kê seller</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerAnalytics; 