'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { MediaItem } from '@/features/admin/components/media/media-item';
import { IMediaItem } from '@/types';

interface MediaGridProps {
  items: IMediaItem[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function MediaGrid({ items, isLoading, selectedIds, onToggle }: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
        <p>No media found. Upload some files to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((media) => (
        <MediaItem
          key={media.id}
          media={media}
          isSelected={selectedIds.has(media.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
