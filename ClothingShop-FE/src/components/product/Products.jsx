import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/ProductSlice";

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <div className="bg-white relative isolate">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                    />
                </div>
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-3xl text-center font-light tracking-tight text-gray-900 pt-6">Our best products</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8 pt-6">
                        {products.map((product) => (
                            <div key={product.id} className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                                <img
                                    src={product.thumbnailUrl}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-xs text-gray-700">
                                            <a href={product.href}>
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {product.name}
                                            </a>
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">{product.color}</p>
                                    </div>
                                    {product.discount > 0 ? (
                                        <div>
                                            <p className="text-xs line-through text-gray-400">
                                                {(product.price).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                            <p className="text-xs font-medium text-gray-900">
                                                {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-gray-900">
                                            {(product.price).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
