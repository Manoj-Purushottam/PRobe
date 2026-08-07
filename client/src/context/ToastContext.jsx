import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

const borderColors = {
  success: '#3fb950',
  error: '#f85149',
  info: '#58a6ff',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#161b22',
              border: '0.5px solid #21262d',
              borderLeft: `3px solid ${borderColors[t.type] || '#58a6ff'}`,
              borderRadius: 8,
              padding: '12px 16px',
              color: '#e6edf3',
              fontSize: 13,
              animation: 'slide-up 0.2s ease-out',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
