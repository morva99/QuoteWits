import React, { useState, useEffect } from 'react';

let toastId = 0;
let toastListeners = [];

// Простой компонент для уведомлений (в проекте использую sonner, это просто запасной вариант)
export const toast = {
  success: (message) => {
    showToast(message, 'success');
  },
  error: (message) => {
    showToast(message, 'error');
  }
};

function showToast(message, type) {
  const id = toastId++;
  toastListeners.forEach(listener => listener({ id, message, type }));
  
  // Через 3 секунды автоматически скрываю уведомление
  setTimeout(() => {
    toastListeners.forEach(listener => listener({ id, remove: true }));
  }, 3000);
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    const listener = (toast) => {
      if (toast.remove) {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    };
    
    toastListeners.push(listener);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);
  
  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg min-w-[300px]
            flex items-center gap-3
            animate-slide-in
            ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}
          `}
        >
          <span className="text-xl">
            {toast.type === 'success' ? '✓' : '✕'}
          </span>
          <span className="flex-1">{toast.message}</span>
        </div>
      ))}
      
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

