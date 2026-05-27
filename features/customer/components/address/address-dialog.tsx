'use client';

import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddressForm } from '@/features/customer/components/address/address-form';
import { useCreateAddress, useUpdateAddress } from '@/features/customer/hooks/use-addresses';
import type { AddressFormData } from '@/features/customer/validator';
import { handleFormError } from '@/lib/form-error';
import type { IAddress } from '@/types';

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If provided the dialog is in edit mode */
  address?: IAddress | null;
}

export function AddressDialog({ open, onOpenChange, address }: AddressDialogProps) {
  const isEdit = Boolean(address);

  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const isPending = isCreating || isUpdating;

  function handleSubmit(data: AddressFormData, form: UseFormReturn<AddressFormData>) {
    if (isEdit && address) {
      updateAddress(
        { id: String(address.id), data },
        {
          onSuccess: () => {
            toast.success('Address updated successfully');
            onOpenChange(false);
          },
          onError: (error) => handleFormError(error as Error, form),
        },
      );
    } else {
      createAddress(data, {
        onSuccess: () => {
          toast.success('Address added successfully');
          onOpenChange(false);
        },
        onError: (error) => handleFormError(error as Error, form),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this address.'
              : 'Fill in the details to save a new address.'}
          </DialogDescription>
        </DialogHeader>

        <AddressForm
          defaultValues={address ?? undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={isEdit ? 'Update Address' : 'Add Address'}
        />
      </DialogContent>
    </Dialog>
  );
}
