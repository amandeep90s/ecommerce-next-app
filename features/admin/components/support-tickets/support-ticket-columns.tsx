'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, EllipsisVerticalIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useDeleteSupportTicket } from '@/features/admin/hooks/use-delete-support-ticket';
import { useUpdateSupportTicket } from '@/features/admin/hooks/use-update-support-ticket';
import type { ISupportTicketItem, TicketPriority, TicketStatus } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const CATEGORY_LABELS: Record<string, string> = {
  order: 'Order',
  product: 'Product',
  shipping: 'Shipping',
  billing: 'Billing',
  account: 'Account',
  other: 'Other',
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: TicketStatus }) {
  const variants: Record<TicketStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    open: 'default',
    'in-progress': 'secondary',
    resolved: 'outline',
    closed: 'outline',
  };
  return (
    <Badge variant={variants[status]} className="capitalize">
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const cls: Record<TicketPriority, string> = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function TicketDetailSheet({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: ISupportTicketItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: update, isPending } = useUpdateSupportTicket();
  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes ?? '');

  function handleStatusChange(status: TicketStatus) {
    update(
      { id: ticket.id, payload: { status } },
      {
        onSuccess: () => toast.success(`Ticket marked as ${STATUS_LABELS[status]}.`),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function handlePriorityChange(priority: TicketPriority) {
    update(
      { id: ticket.id, payload: { priority } },
      {
        onSuccess: () => toast.success(`Priority set to ${PRIORITY_LABELS[priority]}.`),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function handleSaveNotes() {
    update(
      { id: ticket.id, payload: { adminNotes } },
      {
        onSuccess: () => toast.success('Admin notes saved.'),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-sm">{ticket.ticketNumber}</span>
          </SheetTitle>
          <SheetDescription>
            Submitted on{' '}
            {new Date(ticket.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-5 px-4">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Customer
              </p>
              <p className="text-sm font-medium">{ticket.name}</p>
              <p className="text-muted-foreground text-xs">{ticket.email}</p>
            </div>
            {ticket.orderId && (
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Order ID
                </p>
                <p className="font-mono text-sm">{ticket.orderId}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Category
              </p>
              <p className="text-sm">{CATEGORY_LABELS[ticket.category] ?? ticket.category}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Priority
              </p>
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>

          <Separator />

          {/* Subject + Message */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Subject
            </p>
            <p className="text-sm font-medium">{ticket.subject}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Message
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
          </div>

          <Separator />

          {/* Update Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Status
              </Label>
              <Select
                value={ticket.status}
                onValueChange={(v) => handleStatusChange(v as TicketStatus)}
                disabled={isPending}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Priority
              </Label>
              <Select
                value={ticket.priority}
                onValueChange={(v) => handlePriorityChange(v as TicketPriority)}
                disabled={isPending}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Admin Notes */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Admin Notes
            </Label>
            <Textarea
              placeholder="Add internal notes about this ticket…"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <Button
              size="sm"
              onClick={handleSaveNotes}
              disabled={isPending || adminNotes === (ticket.adminNotes ?? '')}
              className="self-end"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Row Actions ─────────────────────────────────────────────────────────────

function TicketRowActions({ ticket }: { ticket: ISupportTicketItem }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteTicket, isPending } = useDeleteSupportTicket();

  function handleDelete() {
    deleteTicket(ticket.id, {
      onSuccess: () => toast.success('Ticket deleted successfully.'),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Ticket options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setIsDetailOpen(true)}>
            <ExternalLinkIcon className="size-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onSelect={() => setIsDeleteOpen(true)}
          >
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TicketDetailSheet ticket={ticket} open={isDetailOpen} onOpenChange={setIsDetailOpen} />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Ticket"
        description="Permanently delete this support ticket? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

export function getSupportTicketColumns(): ColumnDef<ISupportTicketItem>[] {
  return [
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket #',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">{row.original.ticketNumber}</span>
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
          Customer
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.original.name}</p>
          <p className="text-muted-foreground text-xs">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate text-sm" title={row.original.subject}>
          {row.original.subject}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm capitalize">
          {CATEGORY_LABELS[row.original.category] ?? row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
          Submitted
          <ArrowUpDownIcon className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <TicketRowActions ticket={row.original} />,
    },
  ];
}
