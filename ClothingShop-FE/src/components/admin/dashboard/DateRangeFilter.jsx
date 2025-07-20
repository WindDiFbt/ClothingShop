import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDashboardOverview, fetchCategorySales } from '../../../redux/slices/admin/AnalyticsSlice';

const DateRangeFilter = () => {
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

        dispatch(fetchDashboardOverview({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
        
        dispatch(fetchCategorySales({ 
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString() 
        }));
    };

    return (
        <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
                <button 
                    onClick={() => handleDateRangeChange('7')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dateRange === '7' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    7 ngày
                </button>
                <button 
                    onClick={() => handleDateRangeChange('30')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dateRange === '30' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    30 ngày
                </button>
                <button 
                    onClick={() => handleDateRangeChange('90')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        dateRange === '90' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    90 ngày
                </button>
            </div>
            
            <div className="flex gap-2 items-center">
                <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Từ ngày"
                />
                <span className="text-gray-500">đến</span>
                <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Đến ngày"
                />
                <button 
                    onClick={() => handleDateRangeChange('custom')}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default DateRangeFilter; 