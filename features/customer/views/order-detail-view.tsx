'use client';

import {
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  PackageIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderItems } from '@/features/customer/components/orders/order-items';
import { useGetOrderById } from '@/features/customer/hooks/use-orders';
import type { OrderStatus, PaymentStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200',
};

interface OrderDetailViewProps {
  id: string;
}

export function OrderDetailView({ id }: OrderDetailViewProps) {
  const { data, isLoading } = useGetOrderById(id);
  const order = data?.data;

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
  // Clamp to 0 — totalAmount includes shipping so subtotal - total can be
  // negative when no coupon was applied or when fees push total above subtotal.
  const discountAmount = Math.max(0, subtotal - order.totalAmount);

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/orders"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Order&nbsp;
            <span className="font-mono">{order.orderNumber}</span>
          </h1>
          <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
            <CalendarIcon className="size-3.5" />
            <span>Placed on {new Date(order.orderedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Badge
          className={`mt-2 w-fit border text-sm capitalize sm:mt-0 ${STATUS_STYLES[order.status]}`}
          variant="outline"
        >
          {order.status}
        </Badge>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <PackageIcon className="size-4" />
            Items
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <OrderItems products={order.products} />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Order Summary</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-2 text-sm">
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

      {/* Payment Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <CreditCardIcon className="size-4" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge
              className={`border text-xs capitalize ${PAYMENT_STATUS_STYLES[order.paymentStatus]}`}
              variant="outline"
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info */}
      {order.customerSnapshot && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <UserIcon className="size-4" />
              Customer Info
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.customerSnapshot.name}</p>
            <p className="text-muted-foreground">{order.customerSnapshot.email}</p>
          </CardContent>
        </Card>
      )}

      {/* Note */}
      {order.note && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Order Note</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <p className="text-muted-foreground text-sm">{order.note}</p>
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
          <CardContent className="text-sm">
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
  );
}
