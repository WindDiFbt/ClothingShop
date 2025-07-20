import React, { useState } from 'react';
import axios from '../../utils/APIUtil';

const TestNotificationPanel = () => {
    const [productData, setProductData] = useState({ productName: '', userName: '' });
    const [orderData, setOrderData] = useState({ orderId: '', customerName: '', totalAmount: '' });
    const [generalData, setGeneralData] = useState({ message: '', type: 'info' });
    const [loading, setLoading] = useState(false);

    const testProductNotification = async () => {
        if (!productData.productName || !productData.userName) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/admin/test-notifications/product', productData);
            alert('Đã gửi thông báo sản phẩm!');
        } catch (error) {
            console.error('Error testing product notification:', error);
            alert('Lỗi khi gửi thông báo sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const testOrderNotification = async () => {
        if (!orderData.orderId || !orderData.customerName || !orderData.totalAmount) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/admin/test-notifications/order', {
                ...orderData,
                totalAmount: parseFloat(orderData.totalAmount)
            });
            alert('Đã gửi thông báo đơn hàng!');
        } catch (error) {
            console.error('Error testing order notification:', error);
            alert('Lỗi khi gửi thông báo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const testGeneralNotification = async () => {
        if (!generalData.message) {
            alert('Vui lòng nhập nội dung thông báo');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/admin/test-notifications/general', generalData);
            alert('Đã gửi thông báo chung!');
        } catch (error) {
            console.error('Error testing general notification:', error);
            alert('Lỗi khi gửi thông báo chung');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Test SignalR Notifications</h3>
            
            <div className="space-y-6">
                {/* Product Notification Test */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">📦 Test Product Notification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Tên sản phẩm"
                            value={productData.productName}
                            onChange={(e) => setProductData(prev => ({ ...prev, productName: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Tên người dùng"
                            value={productData.userName}
                            onChange={(e) => setProductData(prev => ({ ...prev, userName: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={testProductNotification}
                        disabled={loading}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi thông báo sản phẩm'}
                    </button>
                </div>

                {/* Order Notification Test */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">🛒 Test Order Notification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="Mã đơn hàng"
                            value={orderData.orderId}
                            onChange={(e) => setOrderData(prev => ({ ...prev, orderId: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Tên khách hàng"
                            value={orderData.customerName}
                            onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Tổng tiền"
                            value={orderData.totalAmount}
                            onChange={(e) => setOrderData(prev => ({ ...prev, totalAmount: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={testOrderNotification}
                        disabled={loading}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi thông báo đơn hàng'}
                    </button>
                </div>

                {/* General Notification Test */}
                <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">📢 Test General Notification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Nội dung thông báo"
                            value={generalData.message}
                            onChange={(e) => setGeneralData(prev => ({ ...prev, message: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={generalData.type}
                            onChange={(e) => setGeneralData(prev => ({ ...prev, type: e.target.value }))}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="info">Thông tin</option>
                            <option value="success">Thành công</option>
                            <option value="warning">Cảnh báo</option>
                            <option value="error">Lỗi</option>
                        </select>
                    </div>
                    <button
                        onClick={testGeneralNotification}
                        disabled={loading}
                        className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi thông báo chung'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestNotificationPanel; 