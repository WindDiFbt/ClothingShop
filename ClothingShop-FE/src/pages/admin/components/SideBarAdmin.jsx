'use client';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState('');

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            subItems: [
                { title: 'Sales', path: '/admin/sales' }
            ]
        },
        {
            id: 'accounts',
            title: 'Accounts',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            subItems: [
                { title: 'List Accounts', path: '/admin/accounts' }
            ]
        },
        {
            id: 'products',
            title: 'Products',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            subItems: [
                { title: 'Review Product', path: '/admin/review-products' }
            ]
        },
        {
            id: 'reports',
            title: 'Reports',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h3m4 0V7a2 2 0 00-2-2h-7a2 2 0 00-2 2v4m0 4v2a2 2 0 002 2h4a2 2 0 002-2v-2" />
                </svg>
            ),
            subItems: [
                { title: 'Report List', path: '/admin/report' }
            ]
        }
    ];

    const toggleMenu = (menuId) => {
        setExpandedMenu(expandedMenu === menuId ? '' : menuId);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg hover:bg-gray-100"
            >
                <svg
                    className={`h-6 w-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ${
                    isOpen ? 'w-64' : 'w-16'
                }`}
            >
                {/* Navigation */}
                <nav className="mt-16 px-2">
                    {menuItems.map((item) => (
                        <div key={item.id} className="mb-2">
                            <button
                                onClick={() => toggleMenu(item.id)}
                                className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                                    expandedMenu === item.id ? 'bg-gray-100' : ''
                                }`}
                            >
                                <div className="flex items-center">
                                    <span className="text-gray-500">{item.icon}</span>
                                    {isOpen && (
                                        <span className="ml-3 font-medium">{item.title}</span>
                                    )}
                                </div>
                                {isOpen && (
                                    <svg
                                        className={`h-4 w-4 transform transition-transform ${
                                            expandedMenu === item.id ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                )}
                            </button>

                            {/* Submenu */}
                            {isOpen && expandedMenu === item.id && (
                                <div className="mt-1 space-y-1 pl-4">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.path}
                                            to={subItem.path}
                                            className={`block rounded-lg px-4 py-2 text-sm ${
                                                location.pathname === subItem.path
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default SidebarAdmin;