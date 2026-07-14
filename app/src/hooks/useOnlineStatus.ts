import { useState, useEffect } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType: string | null;
}

export function useOnlineStatus(): OnlineStatus {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    effectiveType: null
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    const handleConnectionChange = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setStatus(prev => ({
          ...prev,
          isSlowConnection: connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g',
          effectiveType: connection.effectiveType
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return status;
}
