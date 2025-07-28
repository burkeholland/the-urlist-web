import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create Your List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              List Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., My Favorite Resources"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Custom URL (optional)
            </Label>
            <Input
              id="slug"
              type="text"
              placeholder="my-resources"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave empty to generate automatically
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Tell others what this list is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="min-w-[140px]"
            >
              {!isSubmitting && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              Create List
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}