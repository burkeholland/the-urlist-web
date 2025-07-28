import { useState, useRef } from 'react';
import { Button } from './Button';
import type { FormEvent } from 'react';
import { currentLinks } from '../stores/lists';
import { sanitizeUrl } from '../utils/validation';

interface AddLinkProps {
  listId: number;
  onAdd?: () => void;
}

export function AddLink({ listId, onAdd }: AddLinkProps) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;
    // Allow protocol-relative and protocol-less URLs by normalizing
    const normalizedUrl = sanitizeUrl(url.trim());

    setIsSubmitting(true);
    try {

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl, list_id: listId })
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
    <form onSubmit={handleSubmit}>
      <div className="relative group">
        <div className={`absolute inset-0 bg-[#15BFAE]/5 
          rounded-xl opacity-0 transition-opacity duration-300
          ${isFocused ? 'opacity-100' : 'group-hover:opacity-100'}`}
        />
        <div className="relative flex gap-3">
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter a URL to add to your list"
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 
                transition-all duration-300"
              required
            />
          </div>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? (
              'Adding...'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Link
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}