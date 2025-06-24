import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setCategoryFilter, setPriceFilter, setCurrentPage } from "../../redux/slices/ProductSlice";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import Filters from "./Filter";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import "./Products.css"
import { useLocation, useNavigate } from "react-router-dom";

const ProductList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { products, countProduct, currentPage, pageSize, categoryFilter, priceFilter, loading, error } = useSelector((state) => state.product);
    const [sortQuery, setSortQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        const skip = (currentPage - 1) * pageSize;
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get("search");
        setSearchKeyword(keyword || "")
        let query = `$top=${pageSize}&$skip=${skip}`;
        const filters = [];
        if (categoryFilter.query) filters.push(categoryFilter.query);
        if (priceFilter.query) filters.push(priceFilter.query);
        if (keyword) {
            filters.push(`contains(tolower(Name),'${keyword.toLowerCase()}')`);
        }
        if (filters.length > 0) {
            query += `&$filter=${filters.join(" and ")}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        dispatch(fetchProducts({ query }));
        console.log(query)
    }, [dispatch, currentPage, sortQuery, location.search, categoryFilter, priceFilter]);

    const totalPages = Math.ceil(countProduct / pageSize);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const sortOptions = [
        { name: 'Newest', query: `$orderby=CreateAt desc`, current: false },
        { name: 'Price: Low to High', query: `$orderby=price asc`, current: false },
        { name: 'Price: High to Low', query: `$orderby=price desc`, current: false },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-2">
                    <Filters />
                </div>
                <div className="lg:col-span-10">
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div className="flex items-center justify-between pt-10">
                            <nav aria-label="Breadcrumb">
                                <ol role="list" className="flex space-x-2">
                                    <li>
                                        <div className="flex items-center">
                                            <a href="/home" className="text-sm font-medium text-gray-900">
                                                Home
                                            </a>
                                            <svg
                                                fill="currentColor"
                                                width={16}
                                                height={20}
                                                viewBox="0 0 16 20"
                                                aria-hidden="true"
                                                className="h-5 w-4 text-gray-300 mx-2"
                                            >
                                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                            </svg>
                                        </div>
                                    </li>
                                    <li className="text-sm">
                                        <div className="flex items-center">
                                            <a href="/products" className="text-sm font-medium text-gray-900">
                                                Products
                                            </a>
                                        </div>
                                    </li>
                                    {searchKeyword && (
                                        <div className="flex">
                                            <svg
                                                fill="currentColor"
                                                width={16}
                                                height={20}
                                                viewBox="0 0 16 20"
                                                aria-hidden="true"
                                                className="h-5 w-4 text-gray-300 mx-2"
                                            >
                                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                            </svg>
                                            <li className="text-sm text-gray-500">
                                                Search for: {searchKeyword}
                                            </li>
                                        </div>
                                    )}
                                    {categoryFilter.query && (
                                        <div className="flex">
                                            <svg
                                                fill="currentColor"
                                                width={16}
                                                height={20}
                                                viewBox="0 0 16 20"
                                                aria-hidden="true"
                                                className="h-5 w-4 text-gray-300 mx-2"
                                            >
                                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                            </svg>
                                            <li className="text-sm text-gray-500">
                                                {categoryFilter.name}
                                            </li>
                                        </div>
                                    )}
                                    {priceFilter.query && (
                                        <div className="flex">
                                            <svg
                                                fill="currentColor"
                                                width={16}
                                                height={20}
                                                viewBox="0 0 16 20"
                                                aria-hidden="true"
                                                className="h-5 w-4 text-gray-300 mx-2"
                                            >
                                                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                            </svg>
                                            <li className="text-sm text-gray-500">
                                                {priceFilter.label}
                                            </li>
                                        </div>
                                    )}
                                </ol>
                            </nav>
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="cursor-pointer group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                        Sort
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                                        />
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none"
                                >
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <MenuItem key={option.name}>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSort(option.name);
                                                            setSortQuery(option.query);
                                                        }}
                                                        className={classNames(
                                                            selectedSort === option.name ? 'cursor-pointer font-medium text-gray-900' : 'cursor-pointer text-gray-500',
                                                            'flex px-4 py-2 justify-start text-sm hover:bg-gray-100 w-full'
                                                        )}
                                                    >
                                                        {option.name}
                                                    </button>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                        <div className="flex ">
                            {(priceFilter.query || categoryFilter.query || sortQuery) && (
                                <div className="flex justify-start pt-2 pr-2">
                                    <button
                                        onClick={() => {
                                            dispatch(setPriceFilter(""));
                                            dispatch(setCategoryFilter(""));
                                            setSortQuery("");
                                            setSelectedSort(null);
                                            dispatch(setCurrentPage(1));
                                        }}
                                        className="inline-flex items-center cursor-pointer gap-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-500 hover:text-red-600 hover:shadow-md"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                            {(searchKeyword) && (
                                <div className="flex justify-start pt-2">
                                    <button
                                        onClick={() => {
                                            navigate("/products");
                                        }}
                                        className="inline-flex items-center cursor-pointer gap-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-500 hover:text-red-600 hover:shadow-md"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>

                        {products?.length === 0 && (
                            <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
                        )}

                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 pt-6">
                            {products.map((product) => (
                                <div key={product.Id} className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                                    <img
                                        src={product.ThumbnailUrl}
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-xs text-gray-700">
                                                <a href={`/product/${product.Id}`} className="font-medium text-gray-900 hover:text-gray-700">
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.Name}
                                                </a>
                                            </h3>
                                        </div>
                                        {product.Discount > 0 ? (
                                            <div>
                                                <p className="text-xs line-through text-gray-400">
                                                    {(product.Price).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </p>
                                                <p className="text-xs font-medium text-gray-900">
                                                    {(product.Price * (1 - product.Discount / 100)).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs font-medium text-gray-900">
                                                {(product.Price).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {products && countProduct > 8 && (<div className="flex items-center justify-center px-4 py-3 sm:px-6">
                            <div className="flex justify-center mt-10 space-x-2">
                                <a
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => { if (currentPage > 1) dispatch(setCurrentPage(currentPage - 1)) }}
                                    disabled={currentPage <= 1}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon aria-hidden="true" className="size-5" />
                                </a>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`px-3 py-1 border border-gray-300 rounded cursor-pointer ${currentPage === index + 1 ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
                                        onClick={() => dispatch(setCurrentPage(index + 1))}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <a
                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => { if (currentPage < totalPages) dispatch(setCurrentPage(currentPage + 1)) }}
                                    disabled={currentPage >= totalPages}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon aria-hidden="true" className="size-5" />
                                </a>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductList;
