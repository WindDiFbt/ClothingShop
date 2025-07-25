'use client';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/auth/authSlice';
import SignalRService from '../../../services/admin/SignalRService';
import userImg from '../../../assets/user-profile.png';

const HeaderAdmin = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNotificationOpen && !event.target.closest('.notification-dropdown')) {
                setIsNotificationOpen(false);
            }
            if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationOpen, isProfileOpen]);

    useEffect(() => {
        // Start SignalR connection
        const initSignalR = async () => {
            await SignalRService.startConnection();
            setIsConnected(SignalRService.getConnectionStatus());
        };

        initSignalR();

        // Set up notification handlers
        SignalRService.onProductNotification((message) => {
            addNotification(message, 'product', 'success');
        });

        SignalRService.onOrderNotification((message) => {
            addNotification(message, 'order', 'info');
        });

        SignalRService.onGeneralNotification((message, type) => {
            addNotification(message, 'general', type);
        });

        // Cleanup on unmount
        return () => {
            SignalRService.stopConnection();
        };
    }, []);

    const addNotification = (message, category, type = 'info') => {
        const newNotification = {
            id: Date.now() + Math.random(),
            message,
            category,
            type,
            timestamp: new Date(),
            isVisible: true
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep max 20 notifications

        // Auto remove after 30 seconds (optional - can be removed if you want notifications to stay forever)
        // setTimeout(() => {
        //     removeNotification(newNotification.id);
        // }, 30000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const handleLogout = () => {
        // Stop SignalR connection
        SignalRService.stopConnection();
        
        // Dispatch logout action
        dispatch(logout());
        
        // Close profile dropdown
        setIsProfileOpen(false);
        
        // Navigate to login page
        navigate('/login');
    };

    const getNotificationIcon = (category, type) => {
        switch (category) {
            case 'product':
                return '📦';
            case 'order':
                return '🛒';
            case 'general':
                switch (type) {
                    case 'success':
                        return '✅';
                    case 'warning':
                        return '⚠️';
                    case 'error':
                        return '❌';
                    default:
                        return '📢';
                }
            default:
                return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

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
                        <div className="relative notification-dropdown">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
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
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                                        {notifications.length > 9 ? '9+' : notifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                Thông báo ({notifications.length})
                                            </h3>
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={() => setNotifications([])}
                                                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                                                >
                                                    Xóa tất cả
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-gray-500">
                                            <div className="text-2xl mb-2">📢</div>
                                            <p className="text-sm">Không có thông báo nào</p>
                                            <p className="text-xs mt-1">Thông báo mới sẽ xuất hiện ở đây</p>
                                        </div>
                                    ) : (
                                        <div className="py-1">
                                            {notifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className={`px-4 py-3 border-l-4 ${getNotificationColor(notification.type)} hover:bg-gray-50 transition-colors cursor-pointer`}
                                                    style={{ borderLeftColor: notification.type === 'success' ? '#10B981' : notification.type === 'warning' ? '#F59E0B' : notification.type === 'error' ? '#EF4444' : '#3B82F6' }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-lg flex-shrink-0">
                                                            {getNotificationIcon(notification.category, notification.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium leading-relaxed break-words">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs opacity-75 mt-1">
                                                                {notification.timestamp.toLocaleDateString('vi-VN')} {notification.timestamp.toLocaleTimeString('vi-VN')}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeNotification(notification.id);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 rounded hover:bg-gray-200"
                                                            title="Xóa thông báo"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                   
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative profile-dropdown">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100"
                            >
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src={userImg}
                                    alt="User profile"
                                />
                            </button>

                            {/* Profile dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
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