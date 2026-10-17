import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Heart, ShoppingBag, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-[#0A261C] text-white border border-[#D4AF37]/40 shadow-2xl rounded-xl p-4 transition-all duration-300 animate-slide-in backdrop-blur-md"
            style={{
              boxShadow: '0 10px 30px rgba(10, 38, 28, 0.4), 0 0 15px rgba(212, 175, 55, 0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'cart' && <ShoppingBag className="w-5 h-5 text-[#D4AF37] shrink-0" />}
              {toast.type === 'wishlist' && <Heart className="w-5 h-5 text-[#E08A98] fill-current shrink-0" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />}
              <span className="text-sm font-medium text-stone-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
