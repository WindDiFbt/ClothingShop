import axios from '../../utils/APIUtil';

const AnalyticsService = {
    getDashboardOverview: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/overview', {
            params: { startDate, endDate }
        }),
    
    getRevenueAnalytics: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/revenue', {
            params: { startDate, endDate }
        }),
    
    getOrderAnalytics: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/orders', {
            params: { startDate, endDate }
        }),
    
    getCustomerAnalytics: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/customers', {
            params: { startDate, endDate }
        }),
    
    getProductAnalytics: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/products', {
            params: { startDate, endDate }
        }),
    
    getReportAnalytics: (startDate, endDate) => 
        axios.get('/admin/analytics/dashboard/reports', {
            params: { startDate, endDate }
        }),

    getCustomerSummary: () => 
        axios.get('/admin/analytics/customers/summary')
};

export default AnalyticsService; 