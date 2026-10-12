import React, { createContext, useState, useCallback, useMemo } from 'react';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  const success = useCallback((msg, duration) => addNotification(msg, 'success', duration), [addNotification]);
  const error = useCallback((msg, duration) => addNotification(msg, 'error', duration), [addNotification]);
  const info = useCallback((msg, duration) => addNotification(msg, 'info', duration), [addNotification]);
  const warning = useCallback((msg, duration) => addNotification(msg, 'warning', duration), [addNotification]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      success,
      error,
      info,
      warning,
    }),
    [notifications, addNotification, removeNotification, success, error, info, warning]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export default NotificationContext;
