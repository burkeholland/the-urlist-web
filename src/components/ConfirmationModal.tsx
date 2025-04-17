import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Focus the modal when it opens
    if (modalRef.current) {
      modalRef.current.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scale-in"
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl font-medium text-white bg-[#F23005] hover:bg-[#d92a04]
              transition-all duration-300 ease-out transform
              hover:-translate-y-0.5 active:translate-y-0
              focus:outline-none focus:ring-2 focus:ring-[#F23005]/50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}