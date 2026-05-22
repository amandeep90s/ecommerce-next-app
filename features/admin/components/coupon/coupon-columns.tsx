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
import { useDeleteCoupon } from '@/features/admin/hooks/use-delete-coupon';
import { usePermanentDeleteCoupon } from '@/features/admin/hooks/use-permanent-delete-coupon';
import { useRestoreCoupon } from '@/features/admin/hooks/use-restore-coupon';
import type { ICouponItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

interface CouponRowActionsProps {
  coupon: ICouponItem;
  filter: 'active' | 'trashed';
}

function CouponRowActions({ coupon, filter }: CouponRowActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);

  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();
  const { mutate: restoreCoupon, isPending: isRestoring } = useRestoreCoupon();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } = usePermanentDeleteCoupon();

  function handleDelete() {
    deleteCoupon(coupon.id, {
      onSuccess: () => toast.success(`"${coupon.code}" moved to trash.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    restoreCoupon(coupon.id, {
      onSuccess: () => toast.success(`"${coupon.code}" restored.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    permanentDelete(coupon.id, {
      onSuccess: () => toast.success(`"${coupon.code}" permanently deleted.`),
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Coupon options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {filter === 'active' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/coupons/${coupon.id}/edit`}>
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
        description={`Move "${coupon.code}" to trash? You can restore it later.`}
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Coupon"
        description={`Restore "${coupon.code}"? It will become active again.`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description={`Permanently delete "${coupon.code}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

interface GetCouponColumnsOptions {
  filter: 'active' | 'trashed';
}

export function getCouponColumns({ filter }: GetCouponColumnsOptions): ColumnDef<ICouponItem>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm font-medium">
          {row.original.code}
        </code>
      ),
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      cell: ({ row }) => `${row.original.discount}%`,
    },
    {
      accessorKey: 'minimumPurchase',
      header: 'Min. Purchase',
      cell: ({ row }) => `₹${row.original.minimumPurchase.toFixed(2)}`,
    },
    {
      accessorKey: 'validFrom',
      header: 'Valid From',
      cell: ({ row }) =>
        new Date(row.original.validFrom).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      accessorKey: 'validTo',
      header: 'Valid To',
      cell: ({ row }) =>
        new Date(row.original.validTo).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        if (row.original.deletedAt) {
          return <Badge variant="destructive">Trashed</Badge>;
        }
        const now = new Date();
        const validTo = new Date(row.original.validTo);
        if (validTo < now) {
          return <Badge variant="outline">Expired</Badge>;
        }
        return row.original.isActive ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="outline">Inactive</Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <CouponRowActions coupon={row.original} filter={filter} />,
    },
  ];
}
