import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopSellingProducts } from '../../redux/slices/topSellingProductsSlice';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TopSellingProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.topSellingProducts);

  useEffect(() => {
    dispatch(fetchTopSellingProducts());
  }, [dispatch]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📦 Sản phẩm bán chạy nhất</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-right">Số lượng đã bán</th>
              <th className="p-3 text-right">Tổng doanh thu</th>
              <th className="p-3 text-left">Chi tiết size</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.productId} className="border-t">
                <td className="p-3">{p.productName}</td>
                <td className="p-3 text-right">{p.totalSold}</td>
                <td className="p-3 text-right">{p.totalRevenue.toLocaleString()}</td>
                <td className="p-3">
                  <ul>
                    {p.sizes.map(s => (
                      <li key={s.size}>
                        Size {s.size}: {s.quantity} sản phẩm - {s.revenue.toLocaleString()}đ
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-medium mb-2">📈 Biểu đồ doanh thu theo sản phẩm</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={products}>
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
          <Legend />
          <Bar dataKey="totalRevenue" fill="#4f46e5" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingProductsPage;
