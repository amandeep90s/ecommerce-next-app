'use client';

import { RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useRestoreMedia } from '@/features/admin/hooks/use-restore-media';

interface RestoreMediaProps {
  selectedIds: Set<string>;
  onSuccess: () => void;
}

export function RestoreMedia({ selectedIds, onSuccess }: RestoreMediaProps) {
  const { mutate: restore, isPending } = useRestoreMedia();
  const count = selectedIds.size;

  function handleRestore() {
    if (count === 0) return;

    restore(
      { ids: Array.from(selectedIds) },
      {
        onSuccess: () => {
          toast.success(`${count} media file(s) restored.`);
          onSuccess();
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to restore media.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <Button variant="outline" onClick={handleRestore} disabled={count === 0 || isPending}>
      <RotateCcwIcon />
      {isPending ? 'Restoring...' : count > 0 ? `Restore (${count})` : 'Restore'}
    </Button>
  );
}
