import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReports } from '../../../redux/slices/admin/ReportSlice';
import { useNavigate } from 'react-router-dom';

const ReportList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reports, loading, error } = useSelector(state => state.adminReport);

    useEffect(() => {
        dispatch(fetchAllReports());
    }, [dispatch]);

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Danh sách báo cáo sản phẩm</h2>
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
                        {reports.map(report => (
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