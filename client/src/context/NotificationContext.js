import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { socket } from '../utils/socket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect and subscribe to order rooms on login
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    socket.connect();

    function joinRooms() {
      if (user.role === 'customer' && user.orders) {
        user.orders.forEach(orderId => {
          socket.emit('joinOrderRoom', orderId);
        });
      }
      // For admin/rider, could join all or specific logic
      // ...
    }

    // Only join rooms after socket is connected
    socket.on('connect', joinRooms);

    return () => {
      socket.off('connect', joinRooms);
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Listen for order status updates
  useEffect(() => {
    function handleOrderStatusUpdate(payload) {
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'orderStatusUpdate',
          ...payload,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setUnreadCount(count => count + 1);
    }
    socket.on('orderStatusUpdate', handleOrderStatusUpdate);
    return () => {
      socket.off('orderStatusUpdate', handleOrderStatusUpdate);
    };
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
