'use client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeaderAdmin = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const notifications = [
        {
            id: 1,
            message: 'New order #1234 has been placed',
            time: '5 minutes ago'
        },
        {
            id: 2,
            message: 'Product "Blue T-Shirt" is low in stock',
            time: '1 hour ago'
        }
    ];

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            {/* <img 
                                className="h-8 w-8" 
                                src="/assets/images/logo.svg" 
                                alt="Logo" 
                            /> */}
                            <span className="ml-2 text-xl font-semibold text-gray-900">
                                Clothing Shop
                            </span>
                        </Link>
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                            >
                                <svg 
                                    className="h-6 w-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                                        Notifications
                                    </div>
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            className="px-4 py-2 hover:bg-gray-50"
                                        >
                                            <p className="text-sm text-gray-900">{notification.message}</p>
                                            <p className="text-xs text-gray-500">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100"
                            >
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src="/assets/images/user-profile.jpeg"
                                    alt="User profile"
                                />
                            </button>

                            {/* Profile dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        to="/logout"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;