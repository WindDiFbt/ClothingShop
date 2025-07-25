import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchCustomers, fetchCustomerStatistics } from '../../../redux/slices/admin_business/customerSlice';
import './CustomerStatistics.css';

const CustomerStatistics = () => {
    const dispatch = useDispatch();
    const { customers, statistics, loading } = useSelector(state => state.customers);

    useEffect(() => {
        dispatch(fetchCustomers({ page: 1, pageSize: 1000 }));
        dispatch(fetchCustomerStatistics());
    }, [dispatch]);

    // Thống kê trạng thái customers - Biểu đồ tròn
    const getStatusChartData = () => {
        const activeCustomers = customers.filter(customer => customer.status === 1).length;
        const inactiveCustomers = customers.filter(customer => customer.status === 2).length;
        const bannedCustomers = customers.filter(customer => customer.status === 3).length;

        return {
            series: [activeCustomers, inactiveCustomers, bannedCustomers],
            options: {
                chart: {
                    type: 'donut',
                    height: 350
                },
                labels: ['Hoạt động', 'Không hoạt động', 'Bị cấm'],
                colors: ['#00E396', '#FEB019', '#FF4560'],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center'
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return Math.round(val) + "%";
                    }
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

    // Thống kê customers theo tháng đăng ký
    const getRegistrationChartData = () => {
        const monthlyStats = {};
        
        customers.forEach(customer => {
            if (customer.createdAt) {
                const month = new Date(customer.createdAt).toISOString().slice(0, 7); // YYYY-MM
                if (!monthlyStats[month]) {
                    monthlyStats[month] = { total: 0, active: 0 };
                }
                monthlyStats[month].total += 1;
                if (customer.status === 1) {
                    monthlyStats[month].active += 1;
                }
            }
        });

        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toISOString().slice(0, 7));
        }

        const totalData = last6Months.map(month => monthlyStats[month]?.total || 0);
        const activeData = last6Months.map(month => monthlyStats[month]?.active || 0);
        const categories = last6Months.map(month => {
            const [year, monthNum] = month.split('-');
            return `${monthNum}/${year}`;
        });

        return {
            series: [
                {
                    name: 'Tổng đăng ký',
                    data: totalData
                },
                {
                    name: 'Đang hoạt động',
                    data: activeData
                }
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: categories
                },
                yaxis: {
                    title: {
                        text: 'Số lượng khách hàng'
                    }
                },
                fill: {
                    opacity: 1
                },
                colors: ['#008FFB', '#00E396'],
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                }
            }
        };
    };

    // Thống kê top customers theo số đơn hàng
    const getTopCustomersData = () => {
        // Lọc customers có totalOrders và sắp xếp
        const customersWithOrders = customers
            .filter(customer => customer.totalOrders && customer.totalOrders > 0)
            .sort((a, b) => b.totalOrders - a.totalOrders)
            .slice(0, 10);

        return {
            series: [{
                name: 'Số đơn hàng',
                data: customersWithOrders.map(customer => customer.totalOrders || 0)
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: customersWithOrders.map(customer => 
                        customer.fullName || customer.userName || `User ${customer.id.slice(0, 8)}`
                    )
                },
                colors: ['#FF6B6B']
            }
        };
    };

    // Thống kê tăng trưởng customers
    const getGrowthChartData = () => {
        const sortedCustomers = [...customers]
            .filter(customer => customer.createdAt)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const cumulativeData = [];
        const dates = [];
        let count = 0;

        sortedCustomers.forEach(customer => {
            count++;
            const date = new Date(customer.createdAt).toLocaleDateString('vi-VN');
            dates.push(date);
            cumulativeData.push(count);
        });

        // Lấy mỗi 10 điểm để tránh quá nhiều data points
        const step = Math.max(1, Math.floor(dates.length / 50));
        const filteredDates = dates.filter((_, index) => index % step === 0);
        const filteredData = cumulativeData.filter((_, index) => index % step === 0);

        return {
            series: [{
                name: 'Tổng số khách hàng',
                data: filteredData
            }],
            options: {
                chart: {
                    type: 'area',
                    height: 350,
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                title: {
                    text: 'Tăng trưởng khách hàng theo thời gian',
                    align: 'center'
                },
                xaxis: {
                    categories: filteredDates,
                    labels: {
                        show: false
                    }
                },
                yaxis: {
                    title: {
                        text: 'Số lượng khách hàng'
                    }
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
                colors: ['#9C27B0']
            }
        };
    };

    const statusChart = getStatusChartData();
    const registrationChart = getRegistrationChartData();
    const topCustomersChart = getTopCustomersData();
    const growthChart = getGrowthChartData();

    if (loading) {
        return (
            <div className="customer-stats-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thống kê khách hàng...</p>
            </div>
        );
    }

    return (
        <div className="customer-statistics">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
                <nav className="breadcrumb">
                    <Link to="/admin-business/sales" className="breadcrumb-link">
                        Dashboard
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/admin-business/customers" className="breadcrumb-link">
                        Quản lý khách hàng
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Thống kê</span>
                </nav>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">👥 Thống kê khách hàng</h1>
                    <p className="page-subtitle">Phân tích chi tiết về khách hàng và hoạt động</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="stats-overview">
                <div className="stats-card total">
                    <div className="stats-icon">👥</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{statistics?.totalCustomers || customers.length}</h3>
                        <p className="stats-label">Tổng khách hàng</p>
                    </div>
                </div>
                <div className="stats-card active">
                    <div className="stats-icon">✅</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{statistics?.activeCustomers || customers.filter(c => c.status === 1).length}</h3>
                        <p className="stats-label">Đang hoạt động</p>
                    </div>
                </div>
                <div className="stats-card new">
                    <div className="stats-icon">🆕</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{statistics?.newCustomersThisMonth || 0}</h3>
                        <p className="stats-label">Mới tháng này</p>
                    </div>
                </div>
                <div className="stats-card with-orders">
                    <div className="stats-icon">🛒</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{statistics?.customersWithOrders || 0}</h3>
                        <p className="stats-label">Đã mua hàng</p>
                    </div>
                </div>
                <div className="stats-card conversion">
                    <div className="stats-icon">📈</div>
                    <div className="stats-content">
                        <h3 className="stats-number">{statistics?.conversionRate?.toFixed(1) || 0}%</h3>
                        <p className="stats-label">Tỷ lệ chuyển đổi</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                {/* Customer Status Distribution */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Phân bố trạng thái khách hàng</h3>
                        <p>Tỷ lệ khách hàng hoạt động vs không hoạt động</p>
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

                {/* Registration Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Xu hướng đăng ký</h3>
                        <p>Số lượng khách hàng đăng ký 6 tháng gần đây</p>
                    </div>
                    <div className="chart-content">
                        <ReactApexChart 
                            options={registrationChart.options} 
                            series={registrationChart.series} 
                            type="bar" 
                            height={350} 
                        />
                    </div>
                </div>

                {/* Customer Growth */}
                <div className="chart-card full-width">
                    <div className="chart-header">
                        <h3>Tăng trưởng khách hàng</h3>
                        <p>Tăng trưởng tích lũy khách hàng theo thời gian</p>
                    </div>
                    <div className="chart-content">
                        <ReactApexChart 
                            options={growthChart.options} 
                            series={growthChart.series} 
                            type="area" 
                            height={350} 
                        />
                    </div>
                </div>

                {/* Top Customers */}
                {topCustomersChart.series[0].data.length > 0 && (
                    <div className="chart-card full-width">
                        <div className="chart-header">
                            <h3>Top khách hàng VIP</h3>
                            <p>10 khách hàng có số đơn hàng nhiều nhất</p>
                        </div>
                        <div className="chart-content">
                            <ReactApexChart 
                                options={topCustomersChart.options} 
                                series={topCustomersChart.series} 
                                type="bar" 
                                height={350} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerStatistics;
