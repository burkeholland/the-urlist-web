import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm w-full animate-scale-in 
        border border-gray-200 dark:border-gray-700 transition-theme duration-300">
        <div className="mb-6 text-gray-900 dark:text-gray-100 text-lg font-medium transition-theme duration-300">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
              hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-[#F23005] hover:bg-[#C41C00] rounded-lg transition-all duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
