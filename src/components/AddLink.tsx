import { useState, useRef } from 'react';
import { Button } from './Button';
import { Badge } from './ui/badge';
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
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add New Link</h3>
          <p className="text-sm text-gray-600">Paste any URL to automatically fetch title and description</p>
        </div>
        <Badge variant="success" className="ml-auto">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Smart
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="group">
        <div className="relative">
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 
            rounded-2xl blur-xl transition-opacity duration-300
            ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
          />
          
          {/* Input container */}
          <div className={`relative flex gap-3 p-2 bg-white/90 backdrop-blur-sm rounded-2xl 
            border-2 transition-all duration-300 shadow-sm
            ${isFocused 
              ? 'border-teal-500 shadow-lg shadow-teal-500/20' 
              : 'border-gray-200 group-hover:border-gray-300 group-hover:shadow-md'
            }`}>
            
            {/* Icon */}
            <div className="flex items-center pl-4">
              <svg className={`w-5 h-5 transition-colors duration-200 
                ${isFocused ? 'text-teal-500' : 'text-gray-400'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            
            {/* Input field */}
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
                placeholder="https://example.com - paste any URL here"
                className="w-full px-4 py-4 bg-transparent border-none outline-none
                  text-gray-900 placeholder-gray-500 text-lg font-medium"
                required
              />
            </div>
            
            {/* Submit button */}
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 
                hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl
                shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 0115.356 2m-15.356 0H9" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Link
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Help text */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            We'll automatically fetch the title, description, and image
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-2 py-1">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Auto-save
            </Badge>
          </div>
        </div>
      </form>
    </div>
  );
}