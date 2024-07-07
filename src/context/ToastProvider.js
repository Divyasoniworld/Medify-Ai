import { useTheme } from 'next-themes';
import React, { createContext, useContext, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import stylesContainer from './ToastProvider.module.css'; // Import the CSS module

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const activeToastIdRef = useRef(null);

  const showToast = useCallback((title, icon, type) => {
    // Get the latest theme value inside the callback
    const currentTheme = theme;

    if (activeToastIdRef.current) {
      toast.dismiss(activeToastIdRef.current);
    }

    const toastOptions = {
      icon: icon || null,
      style: {
        borderRadius: '10px',
        background: currentTheme === "dark" ? "#fff" : "#000",
        color: currentTheme === "dark" ? "#000" : "#fff",
      },
      onClose: () => {
        activeToastIdRef.current = null;
      },
    };

    if (type === 'error') {
      activeToastIdRef.current = toast.error(title, { ...toastOptions, icon: "❌" });
    } else if (type === 'success') {
      activeToastIdRef.current = toast.success(title, { ...toastOptions, icon: "✅" });
    } else {
      activeToastIdRef.current = toast(title, toastOptions);
    }
  }, [theme]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          position: "absolute",
          top: "480px",
        }}
        toastOptions={{
          className: "toaster-mobile", // Apply the CSS module class
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
