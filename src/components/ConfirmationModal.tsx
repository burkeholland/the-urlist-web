import React from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel,
  title = 'Confirm Action',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-2">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              variant === 'danger' ? 'bg-red-100' : 
              variant === 'warning' ? 'bg-yellow-100' : 
              'bg-blue-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                variant === 'danger' ? 'text-red-600' : 
                variant === 'warning' ? 'text-yellow-600' : 
                'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
