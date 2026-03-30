import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: 'border-success/30 bg-success/10',
  error: 'border-danger/30 bg-danger/10',
  warning: 'border-warning/30 bg-warning/10',
  info: 'border-info/30 bg-info/10',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
};

// Global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function setToasts(newToasts: Toast[]) {
  toasts = newToasts;
  toastListeners.forEach((listener) => listener(toasts));
}

export function toast(type: ToastType, title: string, message?: string, duration = 4000) {
  const id = Math.random().toString(36).slice(2, 9);
  const newToast: Toast = { id, type, title, message, duration };
  setToasts([...toasts, newToast]);

  if (duration > 0) {
    setTimeout(() => {
      setToasts(toasts.filter((t) => t.id !== id));
    }, duration);
  }

  return id;
}

toast.success = (title: string, message?: string) => toast('success', title, message);
toast.error = (title: string, message?: string) => toast('error', title, message);
toast.warning = (title: string, message?: string) => toast('warning', title, message);
toast.info = (title: string, message?: string) => toast('info', title, message);

function removeToast(id: string) {
  setToasts(toasts.filter((t) => t.id !== id));
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const Icon = icons[t.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={cn(
        'flex items-start gap-3 w-80 p-4 rounded-xl border backdrop-blur-xl shadow-xl',
        styles[t.type]
      )}
    >
      <Icon size={18} className={cn('shrink-0 mt-0.5', iconStyles[t.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{t.title}</p>
        {t.message && (
          <p className="text-xs text-muted-light mt-0.5">{t.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(t.id)}
        className="shrink-0 text-muted hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setCurrentToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setCurrentToasts);
    };
  }, []);

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {currentToasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
