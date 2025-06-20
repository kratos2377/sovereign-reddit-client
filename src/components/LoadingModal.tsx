import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  message: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 min-w-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
      </div>
    </div>
  );
}; 