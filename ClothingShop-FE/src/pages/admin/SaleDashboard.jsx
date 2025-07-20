import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchDashboardOverview, fetchCategorySales } from '../../redux/slices/admin/AnalyticsSlice';
import OverviewCards from '../../components/admin/dashboard/OverviewCards';
import DateRangeFilter from '../../components/admin/dashboard/DateRangeFilter';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';
import PendingItemsTable from '../../components/admin/dashboard/PendingItemsTable';
import TestNotificationPanel from '../../components/admin/TestNotificationPanel';

const SaleDashboard = () => {
    const dispatch = useDispatch();
    const { loading, error, overview, categorySales } = useSelector(state => state.analytics);

    useEffect(() => {
        // Load initial data with last 30 days
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        dispatch(fetchDashboardOverview({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
        
        dispatch(fetchCategorySales({ 
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

    return (
        <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
                <ul className="flex space-x-2">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] before:mr-2">
                        <span>Sales Analytics</span>
                    </li>
                </ul>
            </div>

            {/* Date Range Filter */}
            <DateRangeFilter />

            {/* Overview Cards */}
            <OverviewCards />

            {/* Charts and Tables */}
            <div className="grid gap-6 lg:grid-cols-3 mb-6">
                {/* Sales By Category */}
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="mb-5">
                        <h5 className="text-lg font-semibold">Doanh số theo danh mục</h5>
                        {categorySales && (
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Tổng doanh thu: {categorySales.totalRevenue?.toLocaleString('vi-VN')}đ</span>
                                <span>{categorySales.totalOrders} đơn hàng</span>
                            </div>
                        )}
                    </div>
                    {/* Category Statistics Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : categorySales?.categoryData && categorySales.categoryData.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3 font-medium text-gray-700">Danh mục</th>
                                        <th className="text-right p-3 font-medium text-gray-700">Doanh thu</th>
                                        <th className="text-center p-3 font-medium text-gray-700">Đơn hàng</th>
                                        <th className="text-center p-3 font-medium text-gray-700">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorySales.categoryData.map((category, index) => (
                                        <tr key={category.categoryId} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || '#3B82F6' }}
                                                    ></div>
                                                    <span className="font-medium">{category.categoryName}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right font-medium">
                                                {category.revenue?.toLocaleString('vi-VN')}đ
                                            </td>
                                            <td className="p-3 text-center text-gray-600">
                                                {category.orderCount}
                                            </td>
                                            <td className="p-3 text-center text-gray-600">
                                                {category.percentage?.toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex justify-center items-center h-32 text-gray-500">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">📊</div>
                                    <div>Không có dữ liệu doanh số theo danh mục</div>
                                    <div className="text-sm mt-1">Trong khoảng thời gian này</div>
                                </div>
                            </div>
                        )}
                    </div>
                    

                </div>

                {/* Recent Orders Table */}
                <div className="lg:col-span-2">
                    <RecentOrdersTable />
                </div>
            </div>

            {/* Pending Items Table */}
            <div className="mb-6">
                <PendingItemsTable />
            </div>

            {/* Additional Stats */}
            {overview && (
                <div className="grid gap-6 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="text-center">
                            <h6 className="text-lg font-semibold text-gray-700">Tỷ lệ hoàn thành</h6>
                            <p className="text-3xl font-bold text-green-600">
                                {overview.totalOrders > 0 
                                    ? Math.round((overview.completedOrders / overview.totalOrders) * 100)
                                    : 0}%
                            </p>
                            <p className="text-sm text-gray-500">
                                {overview.completedOrders} / {overview.totalOrders} đơn hàng
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="text-center">
                            <h6 className="text-lg font-semibold text-gray-700">Giá trị đơn TB</h6>
                            <p className="text-3xl font-bold text-blue-600">
                                {overview.averageOrderValue?.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-gray-500">
                                Trung bình mỗi đơn hàng
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="text-center">
                            <h6 className="text-lg font-semibold text-gray-700">Khách hàng mới</h6>
                            <p className="text-3xl font-bold text-purple-600">
                                {overview.newCustomers}
                            </p>
                            <p className="text-sm text-gray-500">
                                Trong khoảng thời gian này
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="text-center">
                            <h6 className="text-lg font-semibold text-gray-700">Lợi nhuận</h6>
                            <p className="text-3xl font-bold text-green-600">
                                {overview.totalProfit?.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-gray-500">
                                {overview.profitGrowth >= 0 ? '+' : ''}{overview.profitGrowth?.toFixed(1)}% so với kỳ trước
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Notification Panel */}
            <div className="mt-6">
                <TestNotificationPanel />
            </div>
        </div>
    );
};

export default SaleDashboard; 