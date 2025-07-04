import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReports } from '../../../redux/slices/admin/ReportSlice';
import { useNavigate } from 'react-router-dom';

const ReportList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reports, loading, error } = useSelector(state => state.adminReport);
    const [statusFilter, setStatusFilter] = useState('');

    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 1, label: 'Chờ xử lý' },
        { value: 2, label: 'Đang xử lý' },
        { value: 3, label: 'Đã xử lý' },
        { value: 4, label: 'Đã từ chối' },
    ];

    useEffect(() => {
        dispatch(fetchAllReports());
    }, [dispatch]);

    const filteredReports = statusFilter
        ? reports.filter(r => String(r.status) === String(statusFilter))
        : reports;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Danh sách báo cáo sản phẩm</h2>
            <div className="mb-4 flex items-center gap-4">
                <label className="font-medium">Lọc theo trạng thái:</label>
                <select
                    className="form-select px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            <div className="overflow-x-auto">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">ID</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Người gửi</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Sản phẩm</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Lý do</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Trạng thái</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Ngày tạo</th>
                            <th className="text-center py-3 px-4 border-b border-gray-200 font-semibold text-gray-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map(report => (
                            <tr key={report.id} className="hover:bg-gray-50">
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.id}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.userName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.productName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.reason}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.statusName}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">{report.createAt ? new Date(report.createAt).toLocaleString() : '-'}</td>
                                <td className="text-center py-3 px-4 border-b border-gray-200">
                                    <button
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                        onClick={() => navigate(`/admin/report/${report.id}`)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportList; 