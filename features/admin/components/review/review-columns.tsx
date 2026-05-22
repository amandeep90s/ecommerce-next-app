'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  RotateCcwIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteReview } from '@/features/admin/hooks/use-delete-review';
import { usePermanentDeleteReview } from '@/features/admin/hooks/use-permanent-delete-review';
import { useRestoreReview } from '@/features/admin/hooks/use-restore-review';
import type { IReviewItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

interface ReviewRowActionsProps {
  review: IReviewItem;
  filter: 'active' | 'trashed';
}

function ReviewRowActions({ review, filter }: ReviewRowActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutate: restoreReview, isPending: isRestoring } = useRestoreReview();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } = usePermanentDeleteReview();

  function handleDelete() {
    deleteReview(review.id, {
      onSuccess: () => toast.success(`Review by "${review.user.name}" moved to trash.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    restoreReview(review.id, {
      onSuccess: () => toast.success(`Review by "${review.user.name}" restored.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    permanentDelete(review.id, {
      onSuccess: () => toast.success(`Review by "${review.user.name}" permanently deleted.`),
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Review options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {filter === 'active' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/reviews/${review.id}/edit`}>
                  <PencilIcon className="size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isPending}
                onSelect={() => setIsDeleteOpen(true)}
              >
                <Trash2Icon className="size-4" />
                Move to Trash
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem disabled={isPending} onSelect={() => setIsRestoreOpen(true)}>
                <RotateCcwIcon className="size-4" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isPending}
                onSelect={() => setIsPermanentOpen(true)}
              >
                <Trash2Icon className="size-4" />
                Delete Permanently
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Move to Trash"
        description={`Move this review by "${review.user.name}" to trash? You can restore it later.`}
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Review"
        description={`Restore this review by "${review.user.name}"? It will become active again.`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description={`Permanently delete this review by "${review.user.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </>
  );
}

// ─── Star Rating Display ──────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`size-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="text-muted-foreground ml-1 text-xs">{rating}/5</span>
    </div>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

interface GetReviewColumnsOptions {
  filter: 'active' | 'trashed';
}

export function getReviewColumns({ filter }: GetReviewColumnsOptions): ColumnDef<IReviewItem>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => row.original.product?.name ?? '—',
    },
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.user?.name ?? '—'}</span>
          <span className="text-muted-foreground text-xs">{row.original.user?.email ?? ''}</span>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rating
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => (
        <span className="text-muted-foreground max-w-[250px] truncate text-sm">
          {row.original.comment}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ReviewRowActions review={row.original} filter={filter} />,
    },
  ];
}
