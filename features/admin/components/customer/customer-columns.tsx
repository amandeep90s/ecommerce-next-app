'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PowerIcon,
  RotateCcwIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useDeleteCustomer } from '@/features/admin/hooks/use-delete-customer';
import { usePermanentDeleteCustomer } from '@/features/admin/hooks/use-permanent-delete-customer';
import { useRestoreCustomer } from '@/features/admin/hooks/use-restore-customer';
import { useToggleCustomerStatus } from '@/features/admin/hooks/use-toggle-customer-status';
import type { ICustomerItem } from '@/types';

// ─── Row Actions ─────────────────────────────────────────────────────────────

interface CustomerRowActionsProps {
  customer: ICustomerItem;
  filter: 'active' | 'trashed';
}

function CustomerRowActions({ customer, filter }: CustomerRowActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  const { mutate: restoreCustomer, isPending: isRestoring } = useRestoreCustomer();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } = usePermanentDeleteCustomer();
  const { mutate: toggleStatus, isPending: isToggling } = useToggleCustomerStatus();

  function handleDelete() {
    deleteCustomer(customer.id, {
      onSuccess: () => toast.success(`"${customer.name}" moved to trash.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    restoreCustomer(customer.id, {
      onSuccess: () => toast.success(`"${customer.name}" restored.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    permanentDelete(customer.id, {
      onSuccess: () => toast.success(`"${customer.name}" permanently deleted.`),
      onError: (e) => toast.error(e.message),
    });
  }

  function handleToggleStatus() {
    toggleStatus(customer.id, {
      onSuccess: () =>
        toast.success(`"${customer.name}" ${customer.is_active ? 'deactivated' : 'activated'}.`),
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting || isToggling;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Customer options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {filter === 'active' ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/customers/${customer.id}`}>
                  <EyeIcon className="size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isPending} onSelect={() => setIsToggleOpen(true)}>
                <PowerIcon className="size-4" />
                {customer.is_active ? 'Deactivate' : 'Activate'}
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
        open={isToggleOpen}
        onOpenChange={setIsToggleOpen}
        title={customer.is_active ? 'Deactivate Customer' : 'Activate Customer'}
        description={`${customer.is_active ? 'Deactivate' : 'Activate'} "${customer.name}"? ${customer.is_active ? 'They will not be able to sign in.' : 'They will be able to sign in again.'}`}
        confirmLabel={customer.is_active ? 'Deactivate' : 'Activate'}
        variant={customer.is_active ? 'destructive' : 'default'}
        onConfirm={handleToggleStatus}
      />
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Move to Trash"
        description={`Move "${customer.name}" to trash? You can restore them later.`}
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Customer"
        description={`Restore "${customer.name}"? They will become active again.`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description={`Permanently delete "${customer.name}"? This action cannot be undone and will also delete all their addresses.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface GetCustomerColumnsOptions {
  filter: 'active' | 'trashed';
}

export function getCustomerColumns({
  filter,
}: GetCustomerColumnsOptions): ColumnDef<ICustomerItem>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={row.original.avatar?.url} alt={row.original.name} />
            <AvatarFallback className="text-xs">{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-muted-foreground text-xs">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || '—',
    },
    {
      accessorKey: 'is_email_verified',
      header: 'Email Verified',
      cell: ({ row }) =>
        row.original.is_email_verified ? (
          <Badge variant="secondary">Verified</Badge>
        ) : (
          <Badge variant="outline">Unverified</Badge>
        ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        if (row.original.deleteAt) {
          return <Badge variant="destructive">Trashed</Badge>;
        }
        return row.original.is_active ? (
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
          Joined
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
      cell: ({ row }) => <CustomerRowActions customer={row.original} filter={filter} />,
    },
  ];
}
