import { useState, useEffect } from 'react';
import { AddLink } from './AddLink';
import { LinkItem } from './LinkItem';
import { ShareButton } from './ShareButton';
import type { Link } from '../types/link';
import { ConfirmationModal } from './ConfirmationModal';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ListContainerProps {
  listId: number;
}

function DraggableLinkItem({ link, onDelete, onEdit }: { link: Link; onDelete: (id: number) => void; onEdit: (id: number, data: { url: string; title?: string; description?: string }) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <LinkItem
        {...link}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export function ListContainer({ listId }: ListContainerProps) {
  // All hooks must be called unconditionally and at the top
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: number; title: string } | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
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
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      setLinks(links.filter(link => link.id !== linkId));
    } catch (error) {
      console.error('Error deleting link:', error);
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
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-24 bg-[#15BFAE]/10 dark:bg-[#15BFAE]/20 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-16 bg-[#15BFAE]/10 dark:bg-[#15BFAE]/20 rounded-lg"></div>
          <div className="h-16 bg-[#15BFAE]/10 dark:bg-[#15BFAE]/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex(l => l.id === active.id);
    const newIndex = links.findIndex(l => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newLinks = arrayMove(links, oldIndex, newIndex).map((l, idx) => ({ ...l, position: idx + 1 }));
    setLinks(newLinks);
    // Persist new order
    try {
      await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newLinks.map(l => l.id), list_id: listId })
      });
    } catch (e) {
      // Optionally show error toast
      console.error('Failed to save order', e);
    }
  };

  // Restore missing methods for delete confirmation modal
  const openDeleteModal = (link: { id: number; title: string }) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLinkToDelete(null);
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    await handleDeleteLink(linkToDelete.id);
    setIsDeleteModalOpen(false);
    setLinkToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="flex flex-wrap gap-4 items-center justify-between py-2">
        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium px-4 py-2 \
          bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {links.length} {links.length === 1 ? 'link' : 'links'}
        </span>
      </div>
      <AddLink listId={listId} onAdd={fetchLinks} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {links.length > 0 ? (
              links.map((link) => (
                <DraggableLinkItem
                  key={link.id}
                  link={link}
                  onDelete={() => openDeleteModal({ id: link.id, title: link.title })}
                  onEdit={(id, data) => handleEditLink(id, data)}
                />
              ))
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed \
                border-[#15BFAE]/20 dark:border-[#15BFAE]/40 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                <p className="text-lg mb-2">No links yet</p>
                <p className="text-sm">Add your first link using the form above</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
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