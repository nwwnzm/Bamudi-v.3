import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X, BookmarkCheck } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastNotificationProps {
  message: string | null;
  detail?: string | null;
  variant?: ToastVariant;
  onDismiss?: () => void;
  icon?: 'check' | 'bookmark' | 'warning' | 'error';
  className?: string;
  position?: 'bottom-right' | 'top-right' | 'bottom-center';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  detail,
  variant = 'success',
  onDismiss,
  icon = 'check',
  className = '',
  position = 'bottom-right',
}) => {
  if (!message) return null;

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'top-right': 'fixed top-6 right-6',
    'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
  }[position];

  // Role: 'alert' for errors/warnings requiring immediate awareness, 'status' for standard success/info
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  const ariaLive = variant === 'error' ? 'assertive' : 'polite';

  const renderIcon = () => {
    if (icon === 'bookmark') {
      return <BookmarkCheck className="w-5 h-5 text-[#cc310e] shrink-0" aria-hidden="true" />;
    }
    if (variant === 'warning') {
      return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />;
    }
    if (variant === 'error') {
      return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />;
    }
    // Default success check
    return <CheckCircle2 className="w-5 h-5 text-[#cc310e] shrink-0" aria-hidden="true" />;
  };

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`${positionClasses} z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3.5 border border-sky-400/80 max-w-md animate-bounce-subtle backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {renderIcon()}
        <div className="text-xs min-w-0">
          <p className="font-bold text-white leading-tight truncate">{message}</p>
          {detail && <p className="text-sky-200 mt-0.5 truncate leading-snug">{detail}</p>}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus:outline-none"
          aria-label="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
