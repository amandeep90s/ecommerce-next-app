'use client';

import { CalendarIcon, PackageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IOrder, OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

interface OrderCardProps {
  order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const firstProduct = order.products[0];
  const extraCount = order.products.length - 1;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <PackageIcon className="text-muted-foreground size-4" />
          <span className="font-mono text-sm font-medium">
            #{String(order.id).slice(-8).toUpperCase()}
          </span>
        </div>
        <Badge
          className={`border text-xs capitalize ${STATUS_STYLES[order.status]}`}
          variant="outline"
        >
          {order.status}
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-3">
          {firstProduct?.image ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md border">
              <Image
                src={firstProduct.image}
                alt={firstProduct.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : (
            <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-md border">
              <PackageIcon className="text-muted-foreground size-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{firstProduct?.name ?? '—'}</p>
            {extraCount > 0 && (
              <p className="text-muted-foreground text-xs">
                +{extraCount} more item{extraCount > 1 ? 's' : ''}
              </p>
            )}
            <p className="text-muted-foreground mt-1 text-xs">
              {order.products.length} item{order.products.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex items-center justify-between pt-3 pb-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <CalendarIcon className="size-3.5" />
          <span>{new Date(order.orderedAt).toLocaleDateString()}</span>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="text-primary text-xs font-medium hover:underline"
        >
          View Details →
        </Link>
      </CardFooter>
    </Card>
  );
}
