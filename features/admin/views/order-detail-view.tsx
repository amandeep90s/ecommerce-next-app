'use client';

import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/features/admin/components/orders/order-columns';
import {
  useGetAdminOrderById,
  useUpdateOrderStatus,
} from '@/features/admin/hooks/use-admin-orders';
import type { OrderStatus } from '@/types';

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

interface AdminOrderDetailViewProps {
  id: string;
}

export function AdminOrderDetailView({ id }: AdminOrderDetailViewProps) {
  const { data, isLoading } = useGetAdminOrderById(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  const order = data?.data;

  function handleStatusUpdate() {
    if (!order || !selectedStatus) return;
    updateStatus(
      { id: order.id, status: selectedStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to "${selectedStatus}".`);
          setSelectedStatus('');
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Order not found.</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = order.products.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0,
  );
  const discountAmount = Math.max(0, subtotal - order.totalAmount);

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href="/admin/orders">
          <ArrowLeftIcon className="size-4" />
          Back to Orders
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Order <span className="font-mono">#{order.id.slice(-8).toUpperCase()}</span>
          </h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
            <CalendarIcon className="size-3.5" />
            <span>Placed on {new Date(order.orderedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <PackageIcon className="size-4" />
                Order Items
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="divide-y pt-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-14 shrink-0 rounded-md border object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-md border">
                      <PackageIcon className="text-muted-foreground size-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    {(item.color || item.size) && (
                      <p className="text-muted-foreground text-xs">
                        {[item.color, item.size].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    {item.sku && (
                      <p className="text-muted-foreground font-mono text-xs">SKU: {item.sku}</p>
                    )}
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                  </div>
                  <div className="shrink-0 text-right text-sm">
                    <p className="font-medium">
                      ${(item.selling_price * item.quantity).toFixed(2)}
                    </p>
                    {item.selling_price !== item.price && (
                      <p className="text-muted-foreground text-xs line-through">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Order Summary</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {order.couponCode && discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TagIcon className="size-3.5" />
                    Coupon ({order.couponCode})
                  </span>
                  <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          {order.note && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Order Note</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <p className="text-muted-foreground text-sm">{order.note}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Update Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Update Status</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3 pt-4">
              <Select
                value={selectedStatus || order.status}
                onValueChange={(v) => setSelectedStatus(v as OrderStatus)}
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
                className="w-full"
                size="sm"
                disabled={isUpdating || !selectedStatus || selectedStatus === order.status}
                onClick={handleStatusUpdate}
              >
                {isUpdating ? 'Saving…' : 'Save Status'}
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order.customerSnapshot && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <UserIcon className="size-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-1 pt-4 text-sm">
                <p className="font-medium">{order.customerSnapshot.name}</p>
                <p className="text-muted-foreground">{order.customerSnapshot.email}</p>
                <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                  <Link
                    href={`/admin/customers?q=${encodeURIComponent(order.customerSnapshot.email)}`}
                  >
                    View Customer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <MapPinIcon className="size-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-0.5 pt-4 text-sm">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                <p className="mt-1">
                  {order.shippingAddress.address_line1}
                  {order.shippingAddress.address_line2
                    ? `, ${order.shippingAddress.address_line2}`
                    : ''}
                </p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} &ndash;{' '}
                  {order.shippingAddress.postal_code}
                </p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
