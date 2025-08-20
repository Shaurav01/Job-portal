import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = idCounter++;
    const next = { id, type: toast.type || 'info', title: toast.title || '', message: toast.message || '' };
    setToasts((prev) => [...prev, next]);
    const timeout = toast.duration ?? 3000;
    if (timeout > 0) setTimeout(() => remove(id), timeout);
    return id;
  }, [remove]);

  const value = { push, remove, toasts };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
