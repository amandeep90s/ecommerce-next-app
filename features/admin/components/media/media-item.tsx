'use client';

import { CheckIcon, CopyIcon, EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBulkDeleteMedia } from '@/features/admin/hooks/use-delete-media';
import { cn } from '@/lib/utils';
import { IMediaItem } from '@/types';

interface MediaItemProps {
  media: IMediaItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  filter: 'active' | 'trashed';
}

export function MediaItem({ media, isSelected, onToggle, filter }: MediaItemProps) {
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const { mutate: trash, isPending } = useBulkDeleteMedia();

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(media.path);
    toast.success('Link copied to clipboard');
  }

  function handleTrash() {
    trash(
      { ids: [media.id] },
      {
        onSuccess: () => toast.success('File moved to trash.'),
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to move to trash.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <>
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

        {/* Selection checkbox — top-right */}
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

        {/* Three-dot menu — bottom-right (only show for active items) */}
        {filter !== 'trashed' && (
          <div
            className="absolute right-1 bottom-1 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className="bg-background/80 hover:bg-background flex size-6 items-center justify-center rounded-md backdrop-blur-sm transition-colors"
                aria-label="Media options"
              >
                <EllipsisVerticalIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/media/${media.id}/edit`} onClick={(e) => e.stopPropagation()}>
                    <PencilIcon />
                    Edit Image
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <CopyIcon />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTrashOpen(true);
                  }}
                  disabled={isPending}
                >
                  <Trash2Icon />
                  Move to Trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Controlled trash confirm dialog — rendered outside the card */}
      <ConfirmDialog
        open={isTrashOpen}
        onOpenChange={setIsTrashOpen}
        title="Move to trash?"
        description="This file will be moved to trash. You can restore it later."
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleTrash}
      />
    </>
  );
}
