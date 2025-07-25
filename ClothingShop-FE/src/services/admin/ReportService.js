import axios from '../../utils/APIUtil';

const ReportService = {
    getAllReports: () => axios.get('/admin/reports'),
    getReportDetail: (id) => axios.get(`/admin/reports/${id}`),
    updateReportStatus: (id, status) => axios.put(`/admin/reports/${id}/status`, status, { headers: { 'Content-Type': 'application/json' } }),
    sendFeedback: (data) => {
        // data: { reportId, feedback, status }
        return axios.post('/admin/reports/feedback', data);
    },
};

export default ReportService; 