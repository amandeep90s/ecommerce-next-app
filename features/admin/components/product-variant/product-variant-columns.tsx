'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  RotateCcwIcon,
  Trash2Icon,
} from 'lucide-react';
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
import { useDeleteProductVariant } from '@/features/admin/hooks/use-delete-product-variant';
import { usePermanentDeleteProductVariant } from '@/features/admin/hooks/use-permanent-delete-product-variant';
import { useRestoreProductVariant } from '@/features/admin/hooks/use-restore-product-variant';
import type { IProductVariantItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

interface VariantRowActionsProps {
  variant: IProductVariantItem;
  filter: 'active' | 'trashed';
}

function VariantRowActions({ variant, filter }: VariantRowActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);

  const { mutate: deleteVariant, isPending: isDeleting } = useDeleteProductVariant();
  const { mutate: restoreVariant, isPending: isRestoring } = useRestoreProductVariant();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } =
    usePermanentDeleteProductVariant();

  function handleDelete() {
    deleteVariant(variant.id, {
      onSuccess: () => toast.success(`Variant "${variant.sku}" moved to trash.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    restoreVariant(variant.id, {
      onSuccess: () => toast.success(`Variant "${variant.sku}" restored.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    permanentDelete(variant.id, {
      onSuccess: () => toast.success(`Variant "${variant.sku}" permanently deleted.`),
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Variant options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {filter === 'active' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/variants/${variant.id}/edit`}>
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
        description={`Move variant "${variant.sku}" to trash? You can restore it later.`}
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Variant"
        description={`Restore variant "${variant.sku}"? It will become active again.`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description={`Permanently delete variant "${variant.sku}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

interface GetVariantColumnsOptions {
  filter: 'active' | 'trashed';
}

export function getProductVariantColumns({
  filter,
}: GetVariantColumnsOptions): ColumnDef<IProductVariantItem>[] {
  return [
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => row.original.product?.name ?? '—',
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ row }) => <span className="font-medium">{row.original.color}</span>,
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => <Badge variant="outline">{row.original.size}</Badge>,
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => (
        <code className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
          {row.original.sku}
        </code>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => `₹${row.original.selling_price.toFixed(2)}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <Badge variant={row.original.stock > 0 ? 'secondary' : 'destructive'}>
          {row.original.stock}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        if (row.original.deletedAt) {
          return <Badge variant="destructive">Trashed</Badge>;
        }
        return row.original.isActive ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="outline">Inactive</Badge>
        );
      },
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
      cell: ({ row }) => <VariantRowActions variant={row.original} filter={filter} />,
    },
  ];
}
