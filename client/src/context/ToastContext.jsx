import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const ToastContext = createContext(null);

const EXIT_DELAY = 250;
const AUTO_DISMISS_DELAY = 3500;

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast)));

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, EXIT_DELAY);
  }, []);

  const showToast = useCallback(
    ({ type = 'info', message, actionLabel, onAction, duration = AUTO_DISMISS_DELAY }) => {
      const id = createId();
      setToasts((current) => [...current, { id, type, message, actionLabel, onAction, closing: false }]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast]
  );

	useEffect(() => {
		const expired = sessionStorage.getItem('taskflow:session-expired');
		if (!expired) return;

		sessionStorage.removeItem('taskflow:session-expired');
		showToast({ type: 'error', message: 'Session expired. Please login again.' });
	}, [showToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }

  return context;
};