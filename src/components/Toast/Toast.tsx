'use client';

import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#4caf50',
            secondary: '#fff',
          },
          style: {
            background: '#2e7d32',
            color: '#fff',
            border: '1px solid #4caf50',
          },
        },
        error: {
          iconTheme: {
            primary: '#f44336',
            secondary: '#fff',
          },
          style: {
            background: '#d32f2f',
            color: '#fff',
            border: '1px solid #f44336',
          },
        },
      }}
    />
  );
};

export default Toast;