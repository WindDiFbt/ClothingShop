import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportDetail, updateReportStatus, resetUpdateStatus } from '../../../redux/slices/admin/ReportSlice';
import { useParams, useNavigate } from 'react-router-dom';

const statusOptions = [
    { value: 1, label: 'Chờ xử lý' },
    { value: 2, label: 'Đã xử lý' },
    { value: 3, label: 'Đã từ chối' },
];

const ReportDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reportDetail, loading, error, updateSuccess } = useSelector(state => state.adminReport);
    const [status, setStatus] = useState();

    useEffect(() => {
        dispatch(fetchReportDetail(id));
        return () => dispatch(resetUpdateStatus());
    }, [dispatch, id]);

    useEffect(() => {
        if (reportDetail) setStatus(reportDetail.status);
    }, [reportDetail]);

    const handleUpdate = () => {
        dispatch(updateReportStatus({ id, status: Number(status) }));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Chi tiết báo cáo #{id}</h2>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {reportDetail && (
                <div className="space-y-4">
                    <div><b>Người gửi:</b> {reportDetail.userName}</div>
                    <div><b>Sản phẩm:</b> {reportDetail.productName}</div>
                    <div><b>Lý do:</b> {reportDetail.reason}</div>
                    <div><b>Trạng thái:</b> {reportDetail.statusName}</div>
                    <div><b>Ngày tạo:</b> {reportDetail.createAt ? new Date(reportDetail.createAt).toLocaleString() : '-'}</div>
                    <div><b>Ngày cập nhật:</b> {reportDetail.updateAt ? new Date(reportDetail.updateAt).toLocaleString() : '-'}</div>
                    <div>
                        <label className="block mb-1 font-medium">Cập nhật trạng thái</label>
                        <select
                            className="select select-bordered w-full"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            Lưu trạng thái
                        </button>
                        {updateSuccess && <span className="ml-3 text-green-600">Cập nhật thành công!</span>}
                    </div>
                    <button
                        className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportDetail; 