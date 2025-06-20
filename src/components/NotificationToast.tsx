import React, { useState, useEffect } from 'react';

interface NotificationToastProps {
  title: string;
  description: string;
  status: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps extends NotificationToastProps {
  id: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, title, description, status, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 border-l-4 ${getStatusStyles()} shadow-lg rounded-lg p-4 transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const useNotificationToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showNotification = ({ title, description, status }: NotificationToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, status, onClose: removeToast };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );

  return { showNotification, ToastContainer };
}; 