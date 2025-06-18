import React from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';

const SaleDashboard = () => {
    // Revenue Chart Data
    const revenueChart = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
            {
                name: 'Expenses',
                data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1B55E2', '#E7515A'],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                labels: {
                    style: {
                        fontSize: '12px',
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: (value) => {
                        return value / 1000 + 'K';
                    },
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
            },
        },
    };

    // Sales By Category Data
    const salesByCategory = {
        series: [985, 737, 270],
        options: {
            chart: {
                type: 'donut',
                height: 460,
            },
            labels: ['Apparel', 'Sports', 'Others'],
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
                        <span>Sales</span>
                    </li>
                </ul>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="mr-4 grid h-12 w-12 place-content-center rounded-full bg-primary-light text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-lg font-semibold">Income</h6>
                            <p className="text-2xl font-bold">$92,600</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="mr-4 grid h-12 w-12 place-content-center rounded-full bg-success-light text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-lg font-semibold">Profit</h6>
                            <p className="text-2xl font-bold">$37,515</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="mr-4 grid h-12 w-12 place-content-center rounded-full bg-warning-light text-warning">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-lg font-semibold">Expenses</h6>
                            <p className="text-2xl font-bold">$55,085</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Revenue Chart */}
                <div className="rounded-lg bg-white p-4 shadow-sm lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold">Revenue</h5>
                    </div>
                    <p className="mb-4 text-lg">
                        Total Profit <span className="ml-2 text-primary">$10,840</span>
                    </p>
                    <div className="h-[325px] w-full">
                        <ReactApexChart 
                            series={revenueChart.series} 
                            options={revenueChart.options} 
                            type="area" 
                            height="100%" 
                        />
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default SaleDashboard; 