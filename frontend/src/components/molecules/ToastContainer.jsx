import React from 'react';
import { useNotification } from '../../hooks';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-900/90 text-white border-emerald-700',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-900/90 text-white border-rose-700',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-900/90 text-white border-amber-700',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-slate-900/90 text-white border-slate-700',
      icon: <Info className="w-5 h-5 text-brand-400 flex-shrink-0" />,
    },
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {notifications.map((item) => {
        const config = typeConfig[item.type] || typeConfig.info;

        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-soft-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${config.bg}`}
            role="status"
          >
            {config.icon}
            <div className="flex-1 text-sm font-medium leading-snug">{item.message}</div>
            <button
              type="button"
              onClick={() => removeNotification(item.id)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
