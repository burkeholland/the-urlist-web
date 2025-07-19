import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { currentLinks } from '../stores/lists';
import { sanitizeUrl } from '../utils/validation';
import { motion } from 'framer-motion';

interface AddLinkProps {
  listId: number;
  onAdd?: () => void;
}

export function AddLink({ listId, onAdd }: AddLinkProps) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;
    // Allow protocol-relative and protocol-less URLs by normalizing
    const normalizedUrl = sanitizeUrl(url.trim());

    setIsSubmitting(true);
    try {
      // First, fetch metadata for the URL
      const metadataResponse = await fetch(`/api/metadata?url=${encodeURIComponent(normalizedUrl)}`);
      
      if (!metadataResponse.ok) {
        throw new Error('Failed to fetch metadata');
      }
      
      const metadata = await metadataResponse.json();

      // Then create the link with the metadata
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: normalizedUrl, 
          list_id: listId,
          metadata: metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add link');
      }

      const newLink = await response.json();
      currentLinks.set([newLink, ...currentLinks.get()]);
      setUrl('');
      onAdd?.(); // Call the onAdd callback after successfully adding a link
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                inputMode="url"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a URL to add to your list"
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}