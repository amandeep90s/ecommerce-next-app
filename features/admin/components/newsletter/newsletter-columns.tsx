'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteNewsletterSubscriber } from '@/features/admin/hooks/use-delete-newsletter-subscriber';
import type { INewsletterItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

function NewsletterRowActions({ subscriber }: { subscriber: INewsletterItem }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteSubscriber, isPending } = useDeleteNewsletterSubscriber();

  function handleDelete() {
    deleteSubscriber(subscriber.id, {
      onSuccess: () => toast.success('Subscriber removed successfully.'),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Subscriber options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onSelect={() => setIsDeleteOpen(true)}
          >
            <Trash2Icon className="size-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Remove Subscriber"
        description="Permanently remove this subscriber? This action cannot be undone."
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

export function getNewsletterColumns(): ColumnDef<INewsletterItem>[] {
  return [
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.email}</span>,
    },
    {
      accessorKey: 'subscribedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subscribed At
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.subscribedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <NewsletterRowActions subscriber={row.original} />,
    },
  ];
}
