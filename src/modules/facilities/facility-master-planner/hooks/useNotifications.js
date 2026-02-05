import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, details = null) => {
    const id = uuidv4();
    const newNotif = {
      id,
      type, // 'info', 'success', 'warning', 'error'
      message,
      details,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};

export default useNotifications;