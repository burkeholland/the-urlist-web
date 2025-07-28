import { useState } from 'react';
import { Button } from './Button';

export function CreateList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<'title' | 'slug' | 'description' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, slug })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create list');
      }

      const data = await response.json();
      if (!data.slug) {
        throw new Error('No slug returned from server');
      }

      window.location.href = `/list/${data.slug}`;
    } catch (error) {
      console.error('Error creating list:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto w-full p-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}
      <div className="relative group">
        <div className={`absolute inset-0 bg-[#15BFAE]/5 pointer-events-none
          rounded-xl opacity-0 transition-opacity duration-300
          ${focusedInput === 'title' ? 'opacity-100' : 'group-hover:opacity-100'}`} 
        />
        <input
          type="text"
          placeholder="Enter a title for your list"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocusedInput('title')}
          onBlur={() => setFocusedInput(null)}
          className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500 text-lg
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 
            transition-all duration-300"
          required
        />
      </div>

      <div className="relative group">
        <div className={`absolute inset-0 bg-[#15BFAE]/5 pointer-events-none
          rounded-xl opacity-0 transition-opacity duration-300
          ${focusedInput === 'slug' ? 'opacity-100' : 'group-hover:opacity-100'}`} 
        />
        <input
          type="text"
          placeholder="Custom URL (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onFocus={() => setFocusedInput('slug')}
          onBlur={() => setFocusedInput(null)}
          className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 
            transition-all duration-300"
        />
      </div>

      <div className="relative group">
        <div className={`absolute inset-0 bg-[#15BFAE]/5 pointer-events-none
          rounded-xl opacity-0 transition-opacity duration-300
          ${focusedInput === 'description' ? 'opacity-100' : 'group-hover:opacity-100'}`} 
        />
        <textarea
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onFocus={() => setFocusedInput('description')}
          onBlur={() => setFocusedInput(null)}
          className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 
            transition-all duration-300
            min-h-[120px] resize-y"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">{isSubmitting ? 'Creating List...' : 'Create List'}</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
    </form>
  );
}