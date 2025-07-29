import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Your List</CardTitle>
        <CardDescription className="text-center">
          Share your favorite links with a beautiful, easy-to-share URL
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">List Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter a title for your list"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Custom URL</Label>
            <Input
              id="slug"
              type="text"
              placeholder="custom-url-name (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to generate automatically
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a description for your list (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              size="lg"
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create List
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}