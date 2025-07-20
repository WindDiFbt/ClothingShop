import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchDashboardOverview } from '../../redux/slices/admin/AnalyticsSlice';
import OverviewCards from '../../components/admin/dashboard/OverviewCards';
import DateRangeFilter from '../../components/admin/dashboard/DateRangeFilter';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';
import PendingItemsTable from '../../components/admin/dashboard/PendingItemsTable';

const SaleDashboard = () => {
    const dispatch = useDispatch();
    const { loading, error, overview } = useSelector(state => state.analytics);

    useEffect(() => {
        // Load initial data with last 30 days
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        dispatch(fetchDashboardOverview({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
    }, [dispatch]);

    // Sales By Category Data (using real data if available)
    const salesByCategory = {
        series: overview?.categoryData?.map(item => item.revenue) || [985, 737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
            },
            labels: overview?.categoryData?.map(item => item.categoryName) || ['Apparel', 'Sports', 'Others'],
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                offsetY: 16,
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                fontSize: '29px',
                            },
                        },
                    },
                },
            },
        },
    };

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
                        <h5 className="text-lg font-semibold">Sales By Category</h5>
                    </div>
                    <div className="h-[460px] w-full">
                        <ReactApexChart 
                            series={salesByCategory.series} 
                            options={salesByCategory.options} 
                            type="donut" 
                            height="100%" 
                        />
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
        </div>
    );
};

export default SaleDashboard; 