'use client';

import { CheckIcon } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { IMediaItem } from '@/types';

interface MediaItemProps {
  media: IMediaItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function MediaItem({ media, isSelected, onToggle }: MediaItemProps) {
  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
        isSelected ? 'border-primary' : 'hover:border-muted-foreground/30 border-primary/10',
      )}
      onClick={() => onToggle(media.id)}
    >
      <div className="relative aspect-square">
        <Image
          src={media.path}
          alt={media.alt || media.public_id}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Selection checkbox overlay */}
      <div
        className={cn(
          'absolute inset-0 flex items-start justify-end p-2 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        <div
          className={cn(
            'flex size-5 items-center justify-center rounded-full border-2 transition-colors',
            isSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground bg-background',
          )}
        >
          {isSelected && <CheckIcon className="size-3" />}
        </div>
      </div>
    </div>
  );
}
