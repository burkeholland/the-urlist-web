import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-0 shadow-2xl shadow-teal-500/10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge variant="success" className="px-1.5 py-0.5 text-xs">New</Badge>
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create Your List
          </CardTitle>
          <p className="text-gray-600 mt-2">Build a beautiful collection of your favorite links</p>
        </CardHeader>
        
        <Separator className="mx-6" />
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-sm">Error creating list</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-900">
                  List Title
                </Label>
                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">Required</Badge>
              </div>
              <Input
                id="title"
                type="text"
                placeholder="e.g., My Awesome Resources, Design Inspiration, Dev Tools..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-12 border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl transition-all duration-200"
                required
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This will be the main heading for your list
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-sm font-semibold text-gray-900">
                Custom URL
                <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">Optional</Badge>
              </Label>
              <div className="relative">
                <Input
                  id="slug"
                  type="text"
                  placeholder="my-awesome-resources"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl pr-20 transition-all duration-200"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  .url
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Leave empty to auto-generate from your title
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
                Description
                <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">Optional</Badge>
              </Label>
              <Textarea
                id="description"
                placeholder="Tell others what this list is about... Perfect for explaining the theme, target audience, or purpose of your collection."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-y border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl transition-all duration-200"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                This helps visitors understand what to expect
              </p>
            </div>

            <Separator />

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                className="min-w-[180px] h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {!isSubmitting && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
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
    </div>
  );
}