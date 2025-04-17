import { useState, useEffect } from 'react';
import { AddLink } from './AddLink';
import { LinkItem } from './LinkItem';
import { ShareButton } from './ShareButton';
import type { Link } from '../types/link';
import { ConfirmationModal } from './ConfirmationModal';

interface ListContainerProps {
  listId: number;
}

export function ListContainer({ listId }: ListContainerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: number; title: string } | null>(null);

  const fetchListData = async () => {
    try {
      const response = await fetch(`/api/lists/${listId}`);
      if (!response.ok) throw new Error('Failed to fetch list');
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await fetch(`/api/links?list_id=${listId}`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListData();
    fetchLinks();
  }, [listId]);

  const handleDeleteLink = async (linkId: number) => {
    // Find the link to get its title for the confirmation message
    const link = links.find(link => link.id === linkId);
    const linkTitle = link?.title || link?.url || 'this link';
    
    // Open confirmation modal
    setLinkToDelete({ id: linkId, title: linkTitle });
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!linkToDelete) return;
    
    try {
      const response = await fetch(`/api/links/${linkToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      setLinks(links.filter(link => link.id !== linkToDelete.id));
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

  const handleEditLink = async (linkId: number, data: { url: string; title?: string; description?: string }) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update link');
      const updatedLink = await response.json();
      setLinks(links.map(link => link.id === linkId ? { ...link, ...updatedLink } : link));
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-[#15BFAE]/10 rounded-lg w-3/4"></div>
        <div className="h-24 bg-[#15BFAE]/10 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-16 bg-[#15BFAE]/10 rounded-lg"></div>
          <div className="h-16 bg-[#15BFAE]/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 break-words">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-gray-600 leading-relaxed break-words">{description}</p>
        )}
        <div className="flex flex-wrap gap-4 items-center justify-between py-2">
          <span className="text-gray-600 text-sm font-medium px-4 py-2 
            bg-gray-50 rounded-xl border border-gray-200">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </div>
      </div>

      <AddLink listId={listId} onAdd={fetchLinks} />

      <div className="space-y-4">
        {links.length > 0 ? (
          links.map((link) => (
            <LinkItem
              key={link.id}
              {...link}
              onDelete={() => handleDeleteLink(link.id)}
              onEdit={(id, data) => handleEditLink(id, data)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed 
            border-[#15BFAE]/20 text-gray-500">
            <p className="text-lg mb-2">No links yet</p>
            <p className="text-sm">Add your first link using the form above</p>
          </div>
        )}
      </div>
      
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