import { useState } from 'react';
import { motion } from 'framer-motion';

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

  const handleSave = () => {
    onEdit(id, {
      url: editUrl,
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.currentTarget.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.currentTarget.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Link title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.currentTarget.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Link description"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="group relative flex items-start gap-4 p-5 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        {/* Drag handle if provided */}
        {dragHandleProps && (
          <button
            {...dragHandleProps}
            tabIndex={0}
            aria-label="Drag to reorder"
            className="mr-2 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle cx="7" cy="6" r="1.5" fill="#A0AEC0" />
              <circle cx="7" cy="10" r="1.5" fill="#A0AEC0" />
              <circle cx="7" cy="14" r="1.5" fill="#A0AEC0" />
              <circle cx="13" cy="6" r="1.5" fill="#A0AEC0" />
              <circle cx="13" cy="10" r="1.5" fill="#A0AEC0" />
              <circle cx="13" cy="14" r="1.5" fill="#A0AEC0" />
            </svg>
          </button>
        )}
        {image && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title || url}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 break-all"
            >
              {title || url}
            </a>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                aria-label="Edit link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                aria-label="Delete link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </div>
          {description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}