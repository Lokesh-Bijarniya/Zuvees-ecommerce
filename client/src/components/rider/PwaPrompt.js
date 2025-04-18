import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaBell, FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import { useRiderPwa } from '../../context/RiderPwaContext';

const PwaPrompt = () => {
  const { 
    canInstall, 
    isInstalled, 
    isOffline, 
    notificationsEnabled,
    installApp, 
    enableNotifications 
  } = useRiderPwa();

  return (
    <AnimatePresence>
      {/* Installation Prompt */}
      {canInstall && !isInstalled && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 bg-gradient-to-br from-cyan-900/90 via-blue-900/90 to-blue-800/90 text-white rounded-xl shadow-xl-glass p-4 z-50 border border-cyan-500/40 backdrop-blur-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex items-center">
            <FaDownload className="text-2xl mr-3 text-cyan-300" />
            <div className="flex-grow">
              <h3 className="font-semibold text-cyan-100">Install Rider App</h3>
              <p className="text-sm text-cyan-200">Add to home screen for offline access</p>
            </div>
            <button
              onClick={installApp}
              className="ml-2 bg-gradient-to-r from-cyan-400 to-blue-400 text-blue-900 px-3 py-1 rounded-md text-sm font-bold shadow hover:from-cyan-300 hover:to-blue-300 transition"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}

      {/* Notification Permission Prompt */}
      {!notificationsEnabled && !isOffline && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-indigo-900/90 text-white rounded-xl shadow-xl-glass p-4 z-50 mt-2 border border-purple-500/40 backdrop-blur-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, delay: 0.2 }}
          style={{ marginTop: canInstall && !isInstalled ? '80px' : '0' }}
        >
          <div className="flex items-center">
            <FaBell className="text-2xl mr-3 text-purple-300" />
            <div className="flex-grow">
              <h3 className="font-semibold text-purple-100">Enable Notifications</h3>
              <p className="text-sm text-purple-200">Get updates on new orders</p>
            </div>
            <button
              onClick={enableNotifications}
              className="ml-2 bg-gradient-to-r from-purple-400 to-indigo-400 text-indigo-900 px-3 py-1 rounded-md text-sm font-bold shadow hover:from-purple-300 hover:to-indigo-300 transition"
            >
              Enable
            </button>
          </div>
        </motion.div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <motion.div
          className="fixed top-16 left-0 right-0 bg-yellow-500 text-white py-2 px-4 z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <div className="flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            <span className="text-sm font-medium">You are offline. Some features may be limited.</span>
          </div>
        </motion.div>
      )}

      {/* Online Indicator */}
      {!isOffline && (
        <motion.div
          className="fixed top-16 left-0 right-0 bg-green-500 text-white py-2 px-4 z-50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center">
            <FaWifi className="mr-2" />
            <span className="text-sm font-medium">Connected</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaPrompt;
