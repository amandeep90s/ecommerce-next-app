'use client';

import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useBulkDeleteMedia } from '@/features/admin/hooks/use-delete-media';

interface DeleteMediaProps {
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function DeleteMedia({ selectedIds, onSuccess }: DeleteMediaProps) {
  const { mutate: bulkDelete, isPending } = useBulkDeleteMedia();
  const count = selectedIds.size;

  function handleDelete() {
    if (count === 0) return;

    bulkDelete(
      { ids: Array.from(selectedIds) },
      {
        onSuccess: () => {
          toast.success(`${count} media file(s) deleted.`);
          onSuccess();
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to delete media.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={count === 0 || isPending}>
      <Trash2Icon />
      {isPending ? 'Deleting...' : count > 0 ? `Trash (${count})` : 'Trash'}
    </Button>
  );
}
