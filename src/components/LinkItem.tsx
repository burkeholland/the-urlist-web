import { useState, useEffect } from 'react';
import { fetchGroups } from '../stores/groups';
import type { LinkGroup } from '../types/group';

interface LinkItemProps {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  group_id?: number | null;
  list_id?: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: { url: string; title?: string; description?: string; group_id?: number | null }) => void;
  dragHandleProps?: any; // dnd-kit listeners for drag handle (optional)
}

export function LinkItem({ id, title, url, description, image, group_id, list_id, onDelete, onEdit, dragHandleProps }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(url);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editGroupId, setEditGroupId] = useState<number | null | undefined>(group_id);
  const [groups, setGroups] = useState<LinkGroup[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typeof list_id === 'number') {
      fetchGroups(list_id).then(setGroups);
    }
  }, [list_id]);

  const handleSave = () => {
    onEdit(id, {
      url: editUrl,
      title: editTitle,
      description: editDescription,
      group_id: editGroupId ?? null
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 space-y-4 \
        border border-gray-200 shadow-sm animate-fade-in">
        <input
          type="url"
          value={editUrl}
          onChange={(e) => setEditUrl(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300"
          placeholder="URL"
        />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300"
          placeholder="Title (optional)"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300 resize-none"
          placeholder="Description (optional)"
          rows={2}
        />
        {/* Group select */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Group</label>
          <select
            value={editGroupId ?? ''}
            onChange={e => setEditGroupId(e.target.value === '' ? null : Number(e.target.value))}
            className="w-full p-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#15BFAE]"
          >
            <option value="">No group</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200
              rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-[#15BFAE] hover:bg-[#03A678]
              rounded-lg transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-4 p-5 rounded-2xl \
      bg-white hover:bg-gray-50
      border border-gray-200
      transition-all duration-300">
      {/* Drag handle if provided */}
      {dragHandleProps && (
        <button
          {...dragHandleProps}
          tabIndex={0}
          aria-label="Drag to reorder"
          className="mr-2 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="7" cy="6" r="1.5" fill="#A0AEC0" /><circle cx="7" cy="10" r="1.5" fill="#A0AEC0" /><circle cx="7" cy="14" r="1.5" fill="#A0AEC0" /><circle cx="13" cy="6" r="1.5" fill="#A0AEC0" /><circle cx="13" cy="10" r="1.5" fill="#A0AEC0" /><circle cx="13" cy="14" r="1.5" fill="#A0AEC0" /></svg>
        </button>
      )}
      <div className="flex-1 min-w-0">
        {/* Group badge */}
        {group_id && (
          <span className="inline-block mb-1 mr-2 px-2 py-0.5 text-xs bg-[#15BFAE]/10 text-[#15BFAE] rounded-full">
            Group: {groups.find(g => g.id === group_id)?.name || group_id}
          </span>
        )}
        <div className="flex items-start justify-between gap-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-gray-900 hover:text-[#15BFAE] 
              transition-colors duration-300 break-all"
          >
            {title || url}
          </a>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-[#15BFAE] 
                hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Edit link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-gray-500 hover:text-[#F23005] 
                hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Delete link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}