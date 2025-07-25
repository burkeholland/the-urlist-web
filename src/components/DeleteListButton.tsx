import { useState } from 'react';
import { Button } from './Button';
import { ConfirmationModal } from './ConfirmationModal';

interface DeleteListButtonProps {
  listId: number;
  onDeleted?: () => void;
}

export function DeleteListButton({ listId, onDeleted }: DeleteListButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete list');
      setIsModalOpen(false);
      onDeleted?.();
    } catch (e: any) {
      setError(e.message || 'Failed to delete list');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsModalOpen(true)}
        isLoading={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Delete List
      </Button>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this list? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}
    </>
  );
}
