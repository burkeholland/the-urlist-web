import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <DialogContent className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full animate-scale-in">
        <DialogHeader>
          <DialogTitle className="mb-6 text-gray-900 text-lg font-medium">
            {message}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-[#F23005] hover:bg-[#C41C00] rounded-lg transition-all duration-300"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}