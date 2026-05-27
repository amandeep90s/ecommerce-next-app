'use client';

import { MapPinIcon, PencilIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteAddress, useSetDefaultAddress } from '@/features/customer/hooks/use-addresses';
import type { IAddress } from '@/types';

interface AddressCardProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  function handleSetDefault() {
    setDefault(String(address.id), {
      onSuccess: () => toast.success('Default address updated'),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleDelete() {
    deleteAddress(String(address.id), {
      onSuccess: () => toast.success('Address deleted'),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <Card className="relative">
      {address.is_default && (
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="text-xs">
            Default
          </Badge>
        </div>
      )}

      <CardContent className="pt-4 pb-2">
        <div className="flex items-start gap-3">
          <MapPinIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
          <div className="min-w-0 space-y-0.5 pr-16">
            <p className="leading-snug font-medium">{address.name}</p>
            <p className="text-muted-foreground text-sm">{address.phone}</p>
            <p className="text-sm">
              {address.address_line1}
              {address.address_line2 ? `, ${address.address_line2}` : ''}
            </p>
            <p className="text-sm">
              {address.city}, {address.state} – {address.postal_code}
            </p>
            <p className="text-sm">{address.country}</p>
            <Badge variant="outline" className="mt-1 text-xs capitalize">
              {address.type}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-2 pb-3">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-xs"
          onClick={() => onEdit(address)}
        >
          <PencilIcon className="size-3" />
          Edit
        </Button>

        {!address.is_default && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-xs"
            onClick={handleSetDefault}
            disabled={isSettingDefault}
          >
            {isSettingDefault ? <Spinner className="size-3" /> : <StarIcon className="size-3" />}
            Set Default
          </Button>
        )}

        <ConfirmDialog
          title="Delete address?"
          description="This address will be permanently removed. This action cannot be undone."
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
          disabled={isDeleting}
          trigger={
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive ml-auto h-7 gap-1 text-xs"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner className="size-3" /> : <Trash2Icon className="size-3" />}
              Delete
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
