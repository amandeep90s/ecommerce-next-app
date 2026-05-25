'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  RotateCcwIcon,
  Trash2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCategory } from '@/features/admin/hooks/use-delete-category';
import { usePermanentDeleteCategory } from '@/features/admin/hooks/use-permanent-delete-category';
import { useRestoreCategory } from '@/features/admin/hooks/use-restore-category';
import type { ICategoryItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

interface CategoryRowActionsProps {
  category: ICategoryItem;
  filter: 'active' | 'trashed';
}

function CategoryRowActions({ category, filter }: CategoryRowActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
  const { mutate: restoreCategory, isPending: isRestoring } = useRestoreCategory();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } = usePermanentDeleteCategory();

  function handleDelete() {
    deleteCategory(category.id, {
      onSuccess: () => toast.success(`"${category.name}" moved to trash.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    restoreCategory(category.id, {
      onSuccess: () => toast.success(`"${category.name}" restored.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    permanentDelete(category.id, {
      onSuccess: () => toast.success(`"${category.name}" permanently deleted.`),
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Category options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {filter === 'active' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${category.id}/edit`}>
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

      {/* Controlled dialogs rendered outside the dropdown to avoid focus-trap issues */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Move to Trash"
        description={`Move "${category.name}" to trash? You can restore it later.`}
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Category"
        description={`Restore "${category.name}"? It will become active again.`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description={`Permanently delete "${category.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

interface GetCategoryColumnsOptions {
  filter: 'active' | 'trashed';
}

export function getCategoryColumns({
  filter,
}: GetCategoryColumnsOptions): ColumnDef<ICategoryItem>[] {
  return [
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) =>
        row.original.image ? (
          <div className="relative size-10 overflow-hidden rounded-md border">
            <Image
              src={row.original.image.path}
              alt={row.original.image.alt || row.original.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-md border text-xs">
            N/A
          </div>
        ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Slug
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <code className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) =>
        row.original.description ? (
          <span className="text-muted-foreground line-clamp-1 max-w-xs text-sm">
            {row.original.description}
          </span>
        ) : (
          <span className="text-muted-foreground/50 text-sm italic">—</span>
        ),
    },
    {
      accessorKey: 'deleteAt',
      header: 'Status',
      cell: ({ row }) =>
        row.original.deleteAt ? (
          <Badge variant="destructive">Trashed</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <CategoryRowActions category={row.original} filter={filter} />,
    },
  ];
}
