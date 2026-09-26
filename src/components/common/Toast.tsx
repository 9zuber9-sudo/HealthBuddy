import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastNotification } from '../../types';

interface ToastProps {
  notification: ToastNotification;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    error: 'bg-rose-50 border-rose-200 text-rose-950',
    warning: 'bg-amber-50 border-amber-200 text-amber-950',
    info: 'bg-sky-50 border-sky-200 text-sky-950',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${bgStyles[notification.type]}`}>
      {icons[notification.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold leading-snug">{notification.title}</h4>
        {notification.message && <p className="text-xs mt-0.5 opacity-90 leading-normal">{notification.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
