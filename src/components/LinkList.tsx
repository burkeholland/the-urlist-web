import { useStore } from '@nanostores/react';
import { currentLinks, fetchLinks } from '../stores/lists';
import { useEffect, useState } from 'react';
import { LinkItem } from './LinkItem';
import type { Link } from '../types/link';

interface LinkListProps {
  listId: number;
}

export function LinkList({ listId }: LinkListProps) {
  const links = useStore(currentLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<Link | null>(null);

  useEffect(() => {
    fetchLinks(listId);
  }, [listId]);

  const handleDeleteLink = (id: number) => {
    // Find the link to get its title/url for the confirmation message
    const link = links.find(link => link.id === id);
    if (link) {
      setLinkToDelete(link);
      setIsModalOpen(true);
    }
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
      // Close the modal and reset linkToDelete
      setIsModalOpen(false);
      setLinkToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setIsModalOpen(false);
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
    <>
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
      </div>

      {/* Tailwind Modal */}
      {isModalOpen && linkToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={cancelDelete}
          ></div>
          
          {/* Modal */}
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6 z-10">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm deletion</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete {linkToDelete.title || linkToDelete.url || "this link"}?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200
                  rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-[#F23005] hover:bg-[#D92B04]
                  rounded-lg transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}