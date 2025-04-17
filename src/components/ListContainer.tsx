import { useState, useEffect } from 'react';
import { AddLink } from './AddLink';
import { LinkItem } from './LinkItem';
import { ShareButton } from './ShareButton';
import type { Link } from '../types/link';
// Use named imports for dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Toast } from './Toast';

interface ListContainerProps {
  listId: number;
}

export function ListContainer({ listId }: ListContainerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Set up the sensors for the drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum distance in pixels before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // Sort the links by position if it exists, otherwise use their current order
      const sortedLinks = [...data].sort((a, b) => {
        if (a.position !== null && b.position !== null) {
          return a.position - b.position;
        }
        return 0;
      });
      setLinks(sortedLinks);
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
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      setLinks(links.filter(link => link.id !== linkId));
      setToast({ message: 'Link deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting link:', error);
      setToast({ message: 'Failed to delete link', type: 'error' });
    }
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
      setToast({ message: 'Link updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating link:', error);
      setToast({ message: 'Failed to update link', type: 'error' });
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    // Return if no change or no over target (dropped outside sortable context)
    if (!over || active.id === over.id) {
      return;
    }

    // Find the indices for the active and over elements
    const oldIndex = links.findIndex(link => link.id === active.id);
    const newIndex = links.findIndex(link => link.id === over.id);
    
    // Move the items in the array
    const updatedLinks = arrayMove(links, oldIndex, newIndex);
    
    // Update the state first for immediate feedback
    setLinks(updatedLinks);
    
    // Update positions based on new order (use array index as position)
    const updatedPositions = updatedLinks.map((link, index) => ({
      id: link.id,
      position: index
    }));

    // Show reordering indicator
    setIsReordering(true);
    
    try {
      const response = await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: updatedPositions })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update positions');
      }
      
      setToast({ message: 'Links reordered successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating positions:', error);
      setToast({ message: 'Failed to save new order', type: 'error' });
      // Revert to the original order if saving fails
      fetchLinks();
    } finally {
      setIsReordering(false);
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map(link => link.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {links.map((link) => (
                  <LinkItem
                    key={link.id}
                    {...link}
                    onDelete={() => handleDeleteLink(link.id)}
                    onEdit={(id, data) => handleEditLink(id, data)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed 
            border-[#15BFAE]/20 text-gray-500">
            <p className="text-lg mb-2">No links yet</p>
            <p className="text-sm">Add your first link using the form above</p>
          </div>
        )}
      </div>

      {isReordering && (
        <div className="fixed bottom-4 left-4 px-4 py-2 bg-white rounded-xl
          shadow-lg border border-[#15BFAE] text-[#15BFAE] flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving new order...
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}