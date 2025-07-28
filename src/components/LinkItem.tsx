import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './Button';
import { cn } from '@/lib/utils';

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
      <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
        <CardContent className="p-6 space-y-4">
          <Input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 transition-all duration-300"
            placeholder="URL"
          />
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 transition-all duration-300"
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.currentTarget.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20 transition-all duration-300 resize-none"
            placeholder="Description"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 hover:border-[#15BFAE]/20 cursor-pointer animate-fade-in overflow-hidden",
      isFocused && "ring-2 ring-[#15BFAE]/20 border-[#15BFAE]"
    )}>
      <div className="flex">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="flex items-center justify-center w-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}

        {/* Image */}
        {image && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#15BFAE] transition-colors">
                  {title}
                </CardTitle>
                <div className="text-sm text-[#15BFAE] font-medium mt-1 truncate">
                  {new URL(url).hostname}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-[#15BFAE] hover:bg-[#15BFAE]/10 rounded-lg transition-all duration-200"
                  title="Edit link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {description && (
              <CardDescription className="text-gray-600 line-clamp-2 leading-relaxed">
                {description}
              </CardDescription>
            )}
          </CardContent>
        </div>
      </div>

      {/* Click overlay to open link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <span className="sr-only">Open {title}</span>
      </a>
    </Card>
  );
}