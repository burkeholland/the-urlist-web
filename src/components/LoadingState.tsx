import { Skeleton } from './ui/skeleton';

export function LinkItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function LoadingState({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <LinkItemSkeleton key={i} />
      ))}
    </div>
  );
}