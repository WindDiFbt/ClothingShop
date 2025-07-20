import React from 'react';
import { useSelector } from 'react-redux';

const PendingItemsTable = () => {
    const { overview, loading } = useSelector(state => state.analytics);

    if (loading) {
        return (
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-5">
                    <h5 className="text-lg font-semibold">Các mục chờ xử lý</h5>
                </div>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!overview?.pendingItems || overview.pendingItems.length === 0) {
        return (
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-5">
                    <h5 className="text-lg font-semibold">Các mục chờ xử lý</h5>
                </div>
                <div className="text-center text-gray-500 py-8">
                    Không có mục nào chờ xử lý
                </div>
            </div>
        );
    }

    const getTypeIcon = (type) => {
        switch(type) {
            case 'product':
                return (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            case 'report':
                return (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'product':
                return 'bg-blue-100 text-blue-800';
            case 'report':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'product':
                return 'Sản phẩm';
            case 'report':
                return 'Báo cáo';
            default:
                return 'Khác';
        }
    };

    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-5">
                <h5 className="text-lg font-semibold">Các mục chờ xử lý</h5>
            </div>
            <div className="space-y-3">
                {overview.pendingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                        {getTypeLabel(item.type)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {item.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tạo lúc: {new Date(item.createdDate).toLocaleString('vi-VN')}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                                Xem chi tiết
                            </button>
                            {item.type === 'product' && (
                                <button className="px-3 py-1 text-xs bg-success text-white rounded hover:bg-success-dark transition-colors">
                                    Duyệt
                                </button>
                            )}
                            {item.type === 'report' && (
                                <button className="px-3 py-1 text-xs bg-warning text-white rounded hover:bg-warning-dark transition-colors">
                                    Xử lý
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {overview.pendingItems.length > 0 && (
                <div className="mt-4 text-center">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                        Xem tất cả →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PendingItemsTable; 