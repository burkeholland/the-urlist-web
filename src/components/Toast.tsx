import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-white',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-gray-900'
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      textColor: 'text-gray-900'
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-200',
      icon: AlertCircle,
      iconColor: 'text-blue-600',
      textColor: 'text-gray-900'
    },
    warning: {
      bg: 'bg-white',
      border: 'border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      textColor: 'text-gray-900'
    }
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 pointer-events-auto
        ${style.bg} ${style.border} border rounded-xl shadow-lg
        transform transition-all duration-200 ease-out
        ${isExiting ? 'translate-y-2 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}
        ${!isExiting ? 'animate-in slide-in-from-bottom-2' : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${style.textColor} leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}