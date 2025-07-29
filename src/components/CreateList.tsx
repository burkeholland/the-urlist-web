import { useState } from 'react';
import { PlusIcon, Loader2Icon } from 'lucide-react';

export function CreateList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#15BFAE]/5 to-[#03A678]/5 px-8 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Your List</h2>
        <p className="text-center text-gray-600">
          Share your favorite links with a beautiful, easy-to-share URL
        </p>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              List Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a title for your list"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15BFAE] focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Custom URL
            </label>
            <input
              id="slug"
              type="text"
              placeholder="custom-url-name (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15BFAE] focus:border-transparent transition-all duration-200"
            />
            <p className="text-xs text-gray-500">
              Leave empty to generate automatically
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Add a description for your list (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 min-h-[100px] bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15BFAE] focus:border-transparent transition-all duration-200 resize-y"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#15BFAE] to-[#03A678] text-white font-medium rounded-lg hover:from-[#03A678] hover:to-[#15BFAE] focus:outline-none focus:ring-2 focus:ring-[#15BFAE] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create List
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}