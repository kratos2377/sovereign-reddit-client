import React from 'react';
import { useToast } from '@chakra-ui/react';

interface NotificationToastProps {
  title: string;
  description: string;
  status: 'success' | 'error' | 'info' | 'warning';
}

export const useNotificationToast = () => {
  const toast = useToast();

  const showNotification = ({ title, description, status }: NotificationToastProps) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return { showNotification };
}; 