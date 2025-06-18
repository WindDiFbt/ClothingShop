import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/ProductSlice";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import Filters from "./Filter";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import "./Products.css"
import { setCurrentPage } from "../../redux/slices/ProductSlice";

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, countProduct, currentPage, pageSize, loading, error } = useSelector((state) => state.product);
    const [sortQuery, setSortQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState(null);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const skip = (currentPage - 1) * pageSize;
        let query = `$top=${pageSize}&$skip=${skip}`;
        if (sortQuery) query += `&${sortQuery}`;
        if (filterQuery) query += `&${filterQuery}`;
        dispatch(fetchProducts({ query }));
    }, [dispatch, currentPage, sortQuery, filterQuery]);

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

    const handleFilterChange = (filter) => {
        setFilterQuery(filter.query);
        setSelectedCategory(filter.name);
        dispatch(setCurrentPage(1));
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-2">
                    <Filters onFilterChange={handleFilterChange} />
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
                                            {selectedCategory && (
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
                                            )}
                                        </div>
                                    </li>
                                    {selectedCategory && (
                                        <li className="text-sm text-gray-500">
                                            {selectedCategory}
                                        </li>
                                    )}
                                </ol>
                            </nav>
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
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
                                                            selectedSort === option.name ? 'font-medium text-gray-900' : 'text-gray-500',
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
                        {(filterQuery || selectedCategory || sortQuery) && (
                            <div className="flex justify-start pt-2">
                                <button
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedCategory(null);
                                        setSortQuery("");
                                        setSelectedSort(null);
                                        dispatch(setCurrentPage(1));
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-500 hover:text-red-600 hover:shadow-md"
                                >
                                    Clear Filters
                                </button>
                            </div>
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
                        <div className="flex items-center justify-center px-4 py-3 sm:px-6">
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
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductList;
