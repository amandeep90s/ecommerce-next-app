'use client';

import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMedia } from '@/features/admin/hooks/use-get-media';
import { cn } from '@/lib/utils';
import type { IMediaItem } from '@/types';

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: IMediaItem[];
  onConfirm: (items: IMediaItem[]) => void;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  selected,
  onConfirm,
}: MediaPickerDialogProps) {
  const [page, setPage] = useState(1);
  const [localSelected, setLocalSelected] = useState<Map<string, IMediaItem>>(() => {
    const map = new Map<string, IMediaItem>();
    selected.forEach((item) => map.set(item.id, item));
    return map;
  });

  const { data, isLoading } = useGetMedia({ filter: 'active', page, limit: 24 });
  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  function handleToggle(media: IMediaItem) {
    const next = new Map(localSelected);
    if (next.has(media.id)) {
      next.delete(media.id);
    } else {
      next.set(media.id, media);
    }
    setLocalSelected(next);
  }

  function handleConfirm() {
    onConfirm(Array.from(localSelected.values()));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose media files to attach to your product. You can select multiple files.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground py-16 text-center text-sm">
              No media found. Upload files in the Media Library first.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {items.map((media) => {
                const isChecked = localSelected.has(media.id);
                return (
                  <div
                    key={media.id}
                    className={cn(
                      'group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all',
                      isChecked
                        ? 'border-primary'
                        : 'hover:border-muted-foreground/30 border-primary/10',
                    )}
                    onClick={() => handleToggle(media)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={media.path}
                        alt={media.alt || media.public_id}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 20vw"
                      />
                    </div>
                    {/* Selection indicator */}
                    <div
                      className={cn(
                        'absolute inset-0 flex items-start justify-end p-1.5 transition-opacity',
                        isChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-5 items-center justify-center rounded-full border-2 transition-colors',
                          isChecked
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground bg-background',
                        )}
                      >
                        {isChecked && <CheckIcon className="size-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">
              Page {page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Select {localSelected.size > 0 ? `(${localSelected.size})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
