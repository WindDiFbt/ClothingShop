import axios from '../../utils/APIUtil';

const AnalyticsService = {
    getDashboardOverview: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/overview', {
            params: { startDate, endDate }
        }),
    
    getCategorySales: (startDate, endDate) => 
        axios.get('/admin/analytics/category-sales', {
            params: { startDate, endDate }
        })
};

export default AnalyticsService; 