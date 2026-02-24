// client/src/components/Notification.js
import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ notifications, onClose }) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.autoClose !== false) {
        const timer = setTimeout(() => {
          onClose(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start p-4 rounded-lg border ${getBgColor(notification.type)} shadow-lg max-w-sm animate-slideIn`}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            {notification.title && (
              <h4 className="text-sm font-semibold mb-1">{notification.title}</h4>
            )}
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
          <button
            onClick={() => onClose(notification.id)}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;