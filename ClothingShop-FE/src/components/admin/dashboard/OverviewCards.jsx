import React from 'react';
import { useSelector } from 'react-redux';

const OverviewCards = () => {
    const { overview, loading } = useSelector(state => state.analytics);

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="text-center text-gray-500">Không có dữ liệu</div>
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: 'Doanh thu',
            value: `${overview.totalRevenue?.toLocaleString('vi-VN')}đ`,
            growth: overview.revenueGrowth,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-primary-light',
            textColor: 'text-primary'
        },
        {
            title: 'Đơn hàng',
            value: overview.totalOrders?.toString(),
            growth: overview.orderGrowth,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            bgColor: 'bg-success-light',
            textColor: 'text-success'
        },
        {
            title: 'Khách hàng',
            value: overview.totalCustomers?.toString(),
            growth: overview.customerGrowth,
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            bgColor: 'bg-warning-light',
            textColor: 'text-warning'
        },
        {
            title: 'Sản phẩm chờ duyệt',
            value: overview.pendingProducts?.toString(),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-info-light',
            textColor: 'text-info'
        },
        {
            title: 'Báo cáo chờ xử lý',
            value: overview.pendingReports?.toString(),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-danger-light',
            textColor: 'text-danger'
        }
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className={`mr-4 grid h-12 w-12 place-content-center rounded-full ${card.bgColor} ${card.textColor}`}>
                            {card.icon}
                        </div>
                        <div>
                            <h6 className="text-lg font-semibold">{card.title}</h6>
                            <p className="text-2xl font-bold">{card.value}</p>
                            {card.growth !== undefined && (
                                <span className={`text-sm ${card.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {card.growth >= 0 ? '+' : ''}{card.growth.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OverviewCards; 