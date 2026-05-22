'use client';

import { ArrowLeftIcon, MailIcon, MapPinIcon, PhoneIcon, PowerIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Separator } from '@/components/ui/separator';
import { useGetCustomerById } from '@/features/admin/hooks/use-get-customer-by-id';
import { useToggleCustomerStatus } from '@/features/admin/hooks/use-toggle-customer-status';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface CustomerDetailViewProps {
  id: string;
}

export function CustomerDetailView({ id }: CustomerDetailViewProps) {
  const { data, isLoading } = useGetCustomerById(id);
  const { mutate: toggleStatus, isPending: isToggling } = useToggleCustomerStatus();
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const customer = data?.data;

  function handleToggleStatus() {
    if (!customer) return;
    toggleStatus(customer.id, {
      onSuccess: () =>
        toast.success(`"${customer.name}" ${customer.is_active ? 'deactivated' : 'activated'}.`),
      onError: (e) => toast.error(e.message),
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="bg-muted h-16 w-16 animate-pulse rounded-full" />
              <div className="bg-muted h-6 w-64 animate-pulse rounded" />
              <div className="bg-muted h-4 w-48 animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Customer not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href="/admin/customers">
          <ArrowLeftIcon className="size-4" />
          Back to Customers
        </Link>
      </Button>

      {/* Customer Info Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">Customer Details</CardTitle>
          <Button
            size="sm"
            variant={customer.is_active ? 'destructive' : 'default'}
            disabled={isToggling}
            onClick={() => setIsToggleOpen(true)}
          >
            <PowerIcon className="size-4" />
            {customer.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar className="size-20">
              <AvatarImage src={customer.avatar?.url} alt={customer.name} />
              <AvatarFallback className="text-lg">{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{customer.name}</h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  {customer.is_active ? (
                    <Badge variant="secondary">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                  {customer.is_email_verified ? (
                    <Badge variant="secondary">Email Verified</Badge>
                  ) : (
                    <Badge variant="outline">Email Unverified</Badge>
                  )}
                </div>
              </div>
              <div className="text-muted-foreground flex flex-col gap-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <MailIcon className="size-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="size-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Joined{' '}
                {new Date(customer.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Addresses ({customer.addresses.length})
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {customer.addresses.length === 0 ? (
            <p className="text-muted-foreground text-sm">No addresses found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {customer.addresses.map((address) => (
                <div key={address.id} className="flex flex-col gap-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="text-muted-foreground size-4" />
                      <span className="font-medium">{address.name}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-xs capitalize">
                        {address.type}
                      </Badge>
                      {address.is_default && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  {address.phone && (
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <PhoneIcon className="size-3" />
                      <span>{address.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isToggleOpen}
        onOpenChange={setIsToggleOpen}
        title={customer.is_active ? 'Deactivate Customer' : 'Activate Customer'}
        description={`${customer.is_active ? 'Deactivate' : 'Activate'} "${customer.name}"? ${customer.is_active ? 'They will not be able to sign in.' : 'They will be able to sign in again.'}`}
        confirmLabel={customer.is_active ? 'Deactivate' : 'Activate'}
        variant={customer.is_active ? 'destructive' : 'default'}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
