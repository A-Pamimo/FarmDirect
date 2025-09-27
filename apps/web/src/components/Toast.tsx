import { useEffect } from 'react';
import { useToastStore } from '../store/toastStore';

export const ToastCenter = () => {
  const { toasts, dismiss } = useToastStore();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => dismiss(toast.id), toast.type === 'error' ? 6000 : 4000)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-4 py-3 shadow-card text-sm font-medium text-white ${
            toast.type === 'success'
              ? 'bg-brand-primary'
              : toast.type === 'error'
              ? 'bg-brand-error'
              : 'bg-brand-accent'
          }`}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.description && <div className="text-xs opacity-90">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
};
