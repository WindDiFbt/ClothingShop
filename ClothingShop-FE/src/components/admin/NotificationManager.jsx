import React, { useEffect, useState } from 'react';
import SignalRService from '../../services/admin/SignalRService';

const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

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

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep max 10 notifications

        // Auto remove after 8 seconds
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 8000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
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
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {/* Connection Status */}
            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isConnected 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
                </div>
            </div>

            {/* Notifications */}
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 rounded-lg border shadow-lg transform transition-all duration-300 ${
                        notification.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    } ${getNotificationColor(notification.type)}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="text-lg">
                            {getNotificationIcon(notification.category, notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-relaxed">
                                {notification.message}
                            </p>
                            <p className="text-xs opacity-75 mt-1">
                                {notification.timestamp.toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationManager; 