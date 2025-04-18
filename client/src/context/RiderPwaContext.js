import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  registerRiderServiceWorker, 
  checkPwaInstallable, 
  installPwa, 
  isPwaInstalled,
  requestNotificationPermission
} from '../riderPwaConfig';

// Create context
const RiderPwaContext = createContext();

export const RiderPwaProvider = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const location = useLocation();
  const isRiderRoute = location.pathname.startsWith('/rider');

  // Register service worker
  useEffect(() => {
    if (isRiderRoute) {
      registerRiderServiceWorker();
    }
  }, [isRiderRoute]);

  // Check if PWA can be installed
  useEffect(() => {
    if (isRiderRoute) {
      checkPwaInstallable(setInstallPrompt);
      setIsInstalled(isPwaInstalled());
    }
  }, [isRiderRoute]);

  // Check notification permission
  useEffect(() => {
    if (isRiderRoute && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, [isRiderRoute]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA installation
  const handleInstallClick = () => {
    installPwa(installPrompt, setInstallPrompt);
  };

  // Request notification permission
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  };

  // Context value
  const value = {
    canInstall: !!installPrompt,
    isInstalled,
    isOffline,
    notificationsEnabled,
    installApp: handleInstallClick,
    enableNotifications
  };

  return (
    <RiderPwaContext.Provider value={value}>
      {children}
    </RiderPwaContext.Provider>
  );
};

// Custom hook to use the Rider PWA context
export const useRiderPwa = () => {
  const context = useContext(RiderPwaContext);
  if (context === undefined) {
    throw new Error('useRiderPwa must be used within a RiderPwaProvider');
  }
  return context;
};

export default RiderPwaContext;
