'use client';

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddressCard } from '@/features/customer/components/address/address-card';
import { AddressDialog } from '@/features/customer/components/address/address-dialog';
import { useGetAddresses } from '@/features/customer/hooks/use-addresses';
import type { IAddress } from '@/types';

export function AddressesView() {
  const { data, isLoading } = useGetAddresses();
  const addresses = data?.data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  function openAdd() {
    setEditingAddress(null);
    setDialogOpen(true);
  }

  function openEdit(address: IAddress) {
    setEditingAddress(address);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">My Addresses</h1>
          <p className="text-muted-foreground text-sm">
            Manage your saved shipping and billing addresses.
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <PlusIcon className="mr-1 size-4" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">No addresses saved yet.</p>
          <Button size="sm" variant="outline" onClick={openAdd}>
            <PlusIcon className="mr-1 size-4" />
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard key={String(address.id)} address={address} onEdit={openEdit} />
          ))}
        </div>
      )}

      <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} address={editingAddress} />
    </div>
  );
}
