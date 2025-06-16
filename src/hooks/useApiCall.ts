import { useState } from 'react';
import { useNotificationToast } from '../components/NotificationToast';

interface UseApiCallOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useApiCall = <T>(
  apiCall: () => Promise<T>,
  options: UseApiCallOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotificationToast();
  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    onSuccess,
    onError,
  } = options;

  const execute = async () => {
    setIsLoading(true);
    try {
      const result = await apiCall();
      showNotification({
        title: 'Success',
        description: successMessage,
        status: 'success',
      });
      onSuccess?.();
      return result;
    } catch (error) {
      showNotification({
        title: 'Error',
        description: errorMessage,
        status: 'error',
      });
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
  };
}; 