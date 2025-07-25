import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchOrders } from '../../../redux/slices/admin_business/orderSlice';
import './OrderStatistics.css';

const OrderStatistics = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, pageSize: 1000 }));
    }, [dispatch]);

    // Thống kê tổng quan
    const getOverviewStats = () => {
        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 4).length;
        const pendingOrders = orders.filter(order => order.status === 1).length;
        const cancelledOrders = orders.filter(order => order.status === 5).length;
        const totalRevenue = orders
            .filter(order => order.status === 4)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return {
            totalOrders,
            completedOrders,
            pendingOrders,
            cancelledOrders,
            totalRevenue,
            completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0
        };
    };

    // Thống kê theo trạng thái - Biểu đồ tròn
    const getStatusChartData = () => {
        const statusCounts = {
            1: orders.filter(order => order.status === 1).length,
            2: orders.filter(order => order.status === 2).length,
            3: orders.filter(order => order.status === 3).length,
            4: orders.filter(order => order.status === 4).length,
            5: orders.filter(order => order.status === 5).length
        };

        return {
            series: Object.values(statusCounts),
            options: {
                chart: {
                    type: 'donut',
                    height: 350
                },
                labels: ['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
                colors: ['#FEB019', '#00E396', '#008FFB', '#00B894', '#E74C3C'],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center'
                },
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
            }
        };
    };

    // Thống kê theo tháng - Biểu đồ cột
    const getMonthlyChartData = () => {
        const monthlyStats = {};
        
        orders.forEach(order => {
            if (order.createAt) {
                const month = new Date(order.createAt).toISOString().slice(0, 7); // YYYY-MM
                if (!monthlyStats[month]) {
                    monthlyStats[month] = { orders: 0, revenue: 0 };
                }
                monthlyStats[month].orders += 1;
                if (order.status === 4) {
                    monthlyStats[month].revenue += order.totalAmount || 0;
                }
            }
        });

        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toISOString().slice(0, 7));
        }

        const orderData = last6Months.map(month => monthlyStats[month]?.orders || 0);
        const revenueData = last6Months.map(month => monthlyStats[month]?.revenue || 0);
        const categories = last6Months.map(month => {
            const [year, monthNum] = month.split('-');
            return `${monthNum}/${year}`;
        });

        return {
            series: [
                {
                    name: 'Số đơn hàng',
                    type: 'column',
                    data: orderData
                },
                {
                    name: 'Doanh thu (VND)',
                    type: 'line',
                    data: revenueData
                }
            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [1, 4]
                },
                xaxis: {
                    categories: categories
                },
                yaxis: [
                    {
                        title: {
                            text: 'Số đơn hàng'
                        }
                    },
                    {
                        opposite: true,
                        title: {
                            text: 'Doanh thu (VND)'
                        }
                    }
                ],
                colors: ['#008FFB', '#00E396'],
                legend: {
                    horizontalAlign: 'left',
                    offsetX: 40
                }
            }
        };
    };

    // Thống kê theo giờ trong ngày
    const getHourlyChartData = () => {
        const hourlyStats = new Array(24).fill(0);
        
        orders.forEach(order => {
            if (order.createAt) {
                const hour = new Date(order.createAt).getHours();
                hourlyStats[hour] += 1;
            }
        });

        return {
            series: [{
                name: 'Số đơn hàng',
                data: hourlyStats
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 350
                },
                xaxis: {
                    categories: Array.from({ length: 24 }, (_, i) => `${i}:00`)
                },
                title: {
                    text: 'Số đơn hàng theo giờ trong ngày',
                    align: 'center'
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                },
                colors: ['#00D9FF']
            }
        };
    };

    const stats = getOverviewStats();
    const statusChart = getStatusChartData();
    const monthlyChart = getMonthlyChartData();
    const hourlyChart = getHourlyChartData();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="order-stats-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thống kê...</p>
            </div>
        );
    }

    return (
        <div className="order-statistics">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/admin-business/orders" className="breadcrumb-link">
                        Quản lý đơn hàng
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Thống kê</span>
                </nav>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">📊 Thống kê đơn hàng</h1>
                    <p className="page-subtitle">Phân tích chi tiết về đơn hàng và doanh thu</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="stats-overview">
                <div className="stats-card total">
                    <div className="stats-icon">📦</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{stats.totalOrders}</h3>
                        <p className="stats-label">Tổng đơn hàng</p>
                    </div>
                </div>
                <div className="stats-card completed">
                    <div className="stats-icon">✅</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{stats.completedOrders}</h3>
                        <p className="stats-label">Đã hoàn thành</p>
                    </div>
                </div>
                <div className="stats-card pending">
                    <div className="stats-icon">⏳</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{stats.pendingOrders}</h3>
                        <p className="stats-label">Chờ xử lý</p>
                    </div>
                </div>
                <div className="stats-card revenue">
                    <div className="stats-icon">💰</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{formatCurrency(stats.totalRevenue)}</h3>
                        <p className="stats-label">Tổng doanh thu</p>
                    </div>
                </div>
                <div className="stats-card rate">
                    <div className="stats-icon">📈</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{stats.completionRate}%</h3>
                        <p className="stats-label">Tỷ lệ hoàn thành</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                {/* Status Distribution Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Phân bố theo trạng thái</h3>
                        <p>Tỷ lệ đơn hàng theo từng trạng thái</p>
                    </div>
                    <div className="chart-content">
                        <ReactApexChart 
                            options={statusChart.options} 
                            series={statusChart.series} 
                            type="donut" 
                            height={350} 
                        />
                    </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Xu hướng theo tháng</h3>
                        <p>Số đơn hàng và doanh thu 6 tháng gần đây</p>
                    </div>
                    <div className="chart-content">
                        <ReactApexChart 
                            options={monthlyChart.options} 
                            series={monthlyChart.series} 
                            type="line" 
                            height={350} 
                        />
                    </div>
                </div>

                {/* Hourly Distribution Chart */}
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <h3>Phân bố theo giờ</h3>
                        <p>Số lượng đơn hàng được đặt theo từng giờ trong ngày</p>
                    </div>
                    <div className="chart-content">
                        <ReactApexChart 
                            options={hourlyChart.options} 
                            series={hourlyChart.series} 
                            type="area" 
                            height={350} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatistics;
