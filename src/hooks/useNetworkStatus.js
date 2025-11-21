import { useEffect, useState } from 'react';

/**
 * Hook to detect network connectivity status
 * @returns {Object} { isOnline: boolean, isSlowNetwork: boolean }
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      console.log('✅ Network is back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('⚠️ Network is offline');
      setIsOnline(false);
    };

    // Listen for connectivity changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check network speed if available
    if (navigator.connection) {
      const handleConnectionChange = () => {
        const conn = navigator.connection;
        const slow = conn.saveData || 
                     conn.effectiveType === 'slow-2g' || 
                     conn.effectiveType === '2g' || 
                     conn.effectiveType === '3g';
        setIsSlowNetwork(slow);
        console.log('Network speed:', conn.effectiveType);
      };

      navigator.connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange(); // Check initial state

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        navigator.connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isSlowNetwork };
};

export default useNetworkStatus;
