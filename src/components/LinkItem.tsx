import { useState } from 'react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface LinkItemProps {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: { url: string; title?: string; description?: string }) => void;
  dragHandleProps?: any; // dnd-kit listeners for drag handle (optional)
}

export function LinkItem({ id, title, url, description, image, onDelete, onEdit, dragHandleProps }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(url);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [isFocused, setIsFocused] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSave = () => {
    onEdit(id, {
      url: editUrl,
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 space-y-4 
        border-2 border-teal-200/50 shadow-xl shadow-teal-500/5 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <Badge variant="secondary" className="text-xs px-2 py-1">
            Editing Mode
          </Badge>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.currentTarget.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20
                transition-all duration-300"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.currentTarget.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20
                transition-all duration-300"
              placeholder="Custom title for your link"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.currentTarget.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20
                transition-all duration-300 resize-none"
              placeholder="Add a helpful description..."
              rows={3}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200
              rounded-xl font-medium transition-all duration-300 hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 text-white bg-gradient-to-r from-teal-600 to-blue-600 
              hover:from-teal-700 hover:to-blue-700 rounded-xl font-medium
              transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
      border border-gray-200/50 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10
      transition-all duration-300 hover:-translate-y-1">
      
      {/* Drag handle */}
      {dragHandleProps && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            {...dragHandleProps}
            tabIndex={0}
            aria-label="Drag to reorder"
            className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
              <circle cx="7" cy="6" r="1.5" fill="#6B7280"/>
              <circle cx="7" cy="10" r="1.5" fill="#6B7280"/>
              <circle cx="7" cy="14" r="1.5" fill="#6B7280"/>
              <circle cx="13" cy="6" r="1.5" fill="#6B7280"/>
              <circle cx="13" cy="10" r="1.5" fill="#6B7280"/>
              <circle cx="13" cy="14" r="1.5" fill="#6B7280"/>
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-start gap-4 p-6">
        {/* Link preview image */}
        <div className="flex-shrink-0">
          {image && !imageError ? (
            <div className="relative">
              <img
                src={image}
                alt=""
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl"></div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2 text-lg font-semibold text-gray-900 
                hover:text-teal-600 transition-all duration-200 max-w-full"
            >
              <span className="truncate">{title || getDomainFromUrl(url)}</span>
              <svg className="w-4 h-4 text-gray-400 group-hover/link:text-teal-500 transition-colors" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 
                  rounded-lg transition-all duration-200"
                aria-label="Edit link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
                  rounded-lg transition-all duration-200"
                aria-label="Delete link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Domain badge */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 border-gray-200">
              {getDomainFromUrl(url)}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
              Active
            </Badge>
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 pr-4">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover effect gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent 
        scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
}