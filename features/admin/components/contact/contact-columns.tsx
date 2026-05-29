'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  CheckCircle2Icon,
  CircleIcon,
  EllipsisVerticalIcon,
  MessageSquareIcon,
  Trash2Icon,
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useDeleteContactSubmission } from '@/features/admin/hooks/use-delete-contact-submission';
import { useUpdateContactStatus } from '@/features/admin/hooks/use-update-contact-status';
import type { ContactStatus, IContactItem } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContactStatus }) {
  if (status === 'new') {
    return (
      <Badge variant="default" className="gap-1 capitalize">
        <CircleIcon className="size-3" />
        New
      </Badge>
    );
  }
  if (status === 'read') {
    return (
      <Badge variant="secondary" className="gap-1 capitalize">
        <CheckCircle2Icon className="size-3" />
        Read
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 capitalize">
      <MessageSquareIcon className="size-3" />
      Replied
    </Badge>
  );
}

// ─── Detail Sheet ─────────────────────────────────────────────────────────────

function ContactDetailSheet({
  contact,
  open,
  onOpenChange,
}: {
  contact: IContactItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateContactStatus();

  function handleStatusChange(status: ContactStatus) {
    updateStatus(
      { id: contact.id, status },
      {
        onSuccess: () => toast.success(`Marked as ${status}.`),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Contact Submission</SheetTitle>
          <SheetDescription>
            Received on{' '}
            {new Date(contact.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-5 px-4">
          {/* Sender Info */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              From
            </p>
            <p className="font-medium">
              {contact.firstName} {contact.lastName}
            </p>
            <p className="text-muted-foreground text-sm">{contact.email}</p>
          </div>

          <Separator />

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Subject
            </p>
            <p className="text-sm">{contact.subject}</p>
          </div>

          <Separator />

          {/* Message */}
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Message
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>

          <Separator />

          {/* Status */}
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Status
            </p>
            <StatusBadge status={contact.status} />
            <div className="flex flex-wrap gap-2">
              {(['new', 'read', 'replied'] satisfies ContactStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={contact.status === s ? 'default' : 'outline'}
                  size="sm"
                  disabled={contact.status === s || isUpdating}
                  onClick={() => handleStatusChange(s)}
                  className="capitalize"
                >
                  Mark as {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Row Actions ─────────────────────────────────────────────────────────────

function ContactRowActions({ contact }: { contact: IContactItem }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteSubmission, isPending } = useDeleteContactSubmission();

  function handleDelete() {
    deleteSubmission(contact.id, {
      onSuccess: () => toast.success('Submission deleted successfully.'),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Submission options">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => setIsDetailOpen(true)}>
            <MessageSquareIcon className="size-4" />
            View Message
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

      <ContactDetailSheet contact={contact} open={isDetailOpen} onOpenChange={setIsDetailOpen} />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Submission"
        description="Permanently delete this contact submission? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}

// ─── Column Factory ───────────────────────────────────────────────────────────

export function getContactColumns(): ColumnDef<IContactItem>[] {
  return [
    {
      accessorKey: 'firstName',
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
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <span className="block max-w-[200px] truncate text-sm" title={row.original.subject}>
          {row.original.subject}
        </span>
      ),
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
          Received
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
      cell: ({ row }) => <ContactRowActions contact={row.original} />,
    },
  ];
}
