import { useState, useEffect } from 'react';
import { Toast as ShadcnToast, ToastClose } from './ui/toast';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-scale-in">
      <ShadcnToast
        variant={type === 'error' ? 'destructive' : 'success'}
        className={cn(
          "px-6 py-3 rounded-xl shadow-lg border",
          type === 'error' ? 'border-[#F23005] bg-white text-[#F23005]' : 'border-[#15BFAE] bg-white text-[#15BFAE]'
        )}
        role="alert"
      >
        <div className="flex items-center gap-2">
          {type === 'error' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {message}
        </div>
        <ToastClose onClick={() => {
          setIsVisible(false);
          onClose?.();
        }} />
      </ShadcnToast>
    </div>
  );
}