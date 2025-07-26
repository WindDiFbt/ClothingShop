import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSellerAnalytics } from '../../../redux/slices/admin/SellerAnalyticsSlice';

const SellerDateRangeFilter = () => {
    const dispatch = useDispatch();
    const [dateRange, setDateRange] = useState('30'); // days
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const handleDateRangeChange = (range) => {
        setDateRange(range);
        let startDate, endDate;
        
        const today = new Date();
        switch(range) {
            case '7':
                startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                endDate = today;
                break;
            case '30':
                startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                endDate = today;
                break;
            case '90':
                startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                endDate = today;
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) {
                    alert('Vui lòng chọn khoảng thời gian tùy chỉnh');
                    return;
                }
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
                break;
            default:
                startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                endDate = today;
        }

        dispatch(fetchSellerAnalytics({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
    };

    return (
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Quick Date Range Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:mr-2">Khoảng thời gian:</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleDateRangeChange('7')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                dateRange === '7' 
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            7 ngày
                        </button>
                        <button 
                            onClick={() => handleDateRangeChange('30')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                dateRange === '30' 
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            30 ngày
                        </button>
                        <button 
                            onClick={() => handleDateRangeChange('90')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                dateRange === '90' 
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            90 ngày
                        </button>
                    </div>
                </div>
                
                {/* Custom Date Range */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <span className="text-sm font-medium text-gray-700">Hoặc chọn tùy chỉnh:</span>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Từ ngày"
                            />
                            <span className="text-gray-500 font-medium">→</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Đến ngày"
                            />
                        </div>
                        <button 
                            onClick={() => handleDateRangeChange('custom')}
                            disabled={!customStartDate || !customEndDate}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                customStartDate && customEndDate
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Current Date Range Display */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                        {dateRange === 'custom' && customStartDate && customEndDate
                            ? `Đang xem: ${new Date(customStartDate).toLocaleDateString('vi-VN')} - ${new Date(customEndDate).toLocaleDateString('vi-VN')}`
                            : `Đang xem: ${dateRange} ngày gần đây`
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SellerDateRangeFilter; 