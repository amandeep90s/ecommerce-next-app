'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, EllipsisVerticalIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateOrderStatus } from '@/features/admin/hooks/use-admin-orders';
import type { IOrder, OrderStatus } from '@/types';

// ─── Status badge helper ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={`border text-xs capitalize ${STATUS_STYLES[status]}`} variant="outline">
      {status}
    </Badge>
  );
}

// ─── Row Actions ──────────────────────────────────────────────────────────────

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

function OrderRowActions({ order }: { order: IOrder }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  function handleStatusChange(newStatus: OrderStatus) {
    updateStatus(
      { id: order.id, status: newStatus },
      {
        onSuccess: () =>
          toast.success(
            `Order #${order.id.slice(-8).toUpperCase()} status updated to "${newStatus}".`,
          ),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Order options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/orders/${order.id}`}>
              <EyeIcon className="size-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setStatusOpen(true)} disabled={isPending}>
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {statusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background w-72 rounded-lg border p-5 shadow-lg">
            <p className="mb-3 text-sm font-medium">Update order status</p>
            <Select
              defaultValue={order.status}
              onValueChange={(v) => {
                handleStatusChange(v as OrderStatus);
                setStatusOpen(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setStatusOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

export function getOrderColumns(): ColumnDef<IOrder>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Order',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          #{row.original.id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'customerSnapshot',
      header: 'Customer',
      cell: ({ row }) => {
        const snap = row.original.customerSnapshot;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{snap?.name ?? '—'}</span>
            <span className="text-muted-foreground text-xs">{snap?.email ?? '—'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'products',
      header: 'Items',
      cell: ({ row }) => {
        const count = row.original.products.length;
        const first = row.original.products[0];
        return (
          <div className="flex flex-col">
            <span className="line-clamp-1 max-w-[180px] text-sm">{first?.name ?? '—'}</span>
            {count > 1 && <span className="text-muted-foreground text-xs">+{count - 1} more</span>}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">${row.original.totalAmount.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'orderedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.orderedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <OrderRowActions order={row.original} />,
    },
  ];
}
