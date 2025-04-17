import { useStore } from '@nanostores/react';
import { currentLinks, fetchLinks } from '../stores/lists';
import { useEffect, useState } from 'react';
import { LinkItem } from './LinkItem';
import type { Link } from '../types/link';
import { ConfirmationModal } from './ConfirmationModal';

interface LinkListProps {
  listId: number;
}

export function LinkList({ listId }: LinkListProps) {
  const links = useStore(currentLinks);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    fetchLinks(listId);
  }, [listId]);

  const handleDeleteLink = async (id: number) => {
    // Find the link to get its title for the confirmation message
    const link = links.find(link => link.id === id);
    const linkTitle = link?.title || link?.url || 'this link';
    
    // Open confirmation modal
    setLinkToDelete({ id, title: linkTitle });
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      const response = await fetch(`/api/links/${linkToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      currentLinks.set(links.filter(link => link.id !== linkToDelete.id));
    } catch (error) {
      console.error('Error deleting link:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setLinkToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLinkToDelete(null);
  };

  const handleEditLink = async (id: number, data: { url: string; title?: string; description?: string }) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update link');
      const updatedLink = await response.json();
      currentLinks.set(links.map(link => link.id === id ? { ...link, ...updatedLink } : link));
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  if (!links) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-retro-purple/10 rounded-lg"></div>
        <div className="h-24 bg-retro-purple/10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link: Link) => (
        <LinkItem
          key={link.id}
          {...link}
          onDelete={() => handleDeleteLink(link.id)}
          onEdit={(id, data) => handleEditLink(id, data)}
        />
      ))}
      {links.length === 0 && (
        <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed 
          border-retro-violet/20 text-retro-cyan/60">
          <p className="text-lg mb-2">No links yet</p>
          <p className="text-sm">Add your first link using the form above</p>
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={linkToDelete ? `Are you sure you want to delete ${linkToDelete.title}?` : ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}