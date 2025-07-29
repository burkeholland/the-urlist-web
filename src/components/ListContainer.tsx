import { useState, useEffect } from 'react';
import { AddLink } from './AddLink';
import { LinkItem } from './LinkItem';
import { ShareButton } from './ShareButton';
import type { Link } from '../types/link';
import { ConfirmationModal } from './ConfirmationModal';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
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
      <div className="max-w-4xl mx-auto w-full">
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-4 w-4 bg-teal-200 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Add link skeleton */}
          <div className="h-24 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200/50"></div>
          
          {/* Links skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/70 rounded-xl border border-gray-200"></div>
            ))}
          </div>
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
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Enhanced header with tabs */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg shadow-teal-500/5">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <Badge variant="secondary" className="px-3 py-1.5 text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                {links.length} {links.length === 1 ? 'Link' : 'Links'}
              </Badge>
            </div>
            
            <Separator orientation="vertical" className="h-6 bg-gray-200" />
            
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs px-2 py-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Public
              </Badge>
              <Badge variant="secondary" className="text-xs px-2 py-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Shareable
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="success" className="text-xs px-2 py-1 animate-pulse">
              Auto-save enabled
            </Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Add Link Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl"></div>
        <div className="relative bg-white/90 backdrop-blur-sm border border-teal-200/50 rounded-2xl p-6">
          <AddLink listId={listId} onAdd={fetchLinks} />
        </div>
      </div>

      {/* Links section with tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              All Links ({links.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              Recent
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag to reorder
          </div>
        </div>

        <TabsContent value="all" className="space-y-4 mt-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
              {links.length > 0 ? (
                <div className="space-y-3">
                  {links.map((link) => (
                    <DraggableLinkItem
                      key={link.id}
                      link={link}
                      onDelete={() => openDeleteModal({ id: link.id, title: link.title })}
                      onEdit={(id, data) => handleEditLink(id, data)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-teal-200/50 bg-gradient-to-br from-teal-50/50 to-blue-50/50">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
                  <p className="text-gray-600 mb-4">Start building your collection by adding your first link above</p>
                  <Badge variant="secondary" className="px-4 py-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick start
                  </Badge>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4 mt-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.slice(0, 5).map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {links.slice(0, 5).map((link) => (
                  <DraggableLinkItem
                    key={link.id}
                    link={link}
                    onDelete={() => openDeleteModal({ id: link.id, title: link.title })}
                    onEdit={(id, data) => handleEditLink(id, data)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={linkToDelete ? `Are you sure you want to delete "${linkToDelete.title}"?` : ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}