'use client';

import { PackageIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { OrderCard } from '@/features/customer/components/orders/order-card';
import { useGetOrders } from '@/features/customer/hooks/use-orders';

export function OrdersView() {
  const { data, isLoading } = useGetOrders();
  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">My Orders</h1>
        <p className="text-muted-foreground text-sm">Track and manage your order history.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <PackageIcon className="text-muted-foreground size-10" />
          <p className="text-muted-foreground text-sm">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
