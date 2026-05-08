'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext({});

const ICONS = {
  success: {
    Icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  error: { Icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  warning: {
    Icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  info: { Icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
};

function ToastItem({ id, message, type = 'info', onRemove }) {
  const { Icon, color, bg } = ICONS[type] || ICONS.info;
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => onRemove(id), 3000);
  }, [id, onRemove]);

  const pauseTimer = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  React.useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, [startTimer]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${bg} pointer-events-auto max-w-[calc(100vw-32px)] min-w-[280px] md:max-w-[380px] md:min-w-[320px]`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      role="status"
      aria-live="polite"
    >
      <Icon size={16} className={`${color} flex-shrink-0`} />
      <p className="flex-1 text-[11px] leading-snug font-bold text-white/80">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 rounded-lg p-0.5 text-white/20 transition-colors hover:text-white/60"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (typeof window === 'undefined') return null;
  return createPortal(
    <div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[10000] flex w-[calc(100%-32px)] -translate-x-1/2 flex-col items-center gap-2.5 md:top-5 md:right-5 md:left-auto md:w-auto md:translate-x-0 md:items-end"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
