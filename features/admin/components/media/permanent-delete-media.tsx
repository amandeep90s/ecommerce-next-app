'use client';

import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { usePermanentDeleteMedia } from '@/features/admin/hooks/use-permanent-delete-media';

interface PermanentDeleteMediaProps {
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function PermanentDeleteMedia({ selectedIds, onSuccess }: PermanentDeleteMediaProps) {
  const { mutate: permanentDelete, isPending } = usePermanentDeleteMedia();
  const count = selectedIds.size;

  function handleDelete() {
    permanentDelete(
      { ids: Array.from(selectedIds) },
      {
        onSuccess: () => {
          toast.success(`${count} media file(s) permanently deleted.`);
          onSuccess();
        },
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : 'Failed to permanently delete media.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" disabled={count === 0 || isPending}>
          <Trash2Icon />
          {isPending ? 'Deleting...' : count > 0 ? `Delete Forever (${count})` : 'Delete Forever'}
        </Button>
      }
      title="Delete permanently?"
      description={`This will permanently delete ${count} file(s) from Cloudinary and cannot be undone.`}
      confirmLabel="Delete Forever"
      variant="destructive"
      onConfirm={handleDelete}
      disabled={count === 0 || isPending}
    />
  );
}
