'use client';

import { PackageIcon } from 'lucide-react';
import Image from 'next/image';

import type { IOrderProduct } from '@/types';

interface OrderItemsProps {
  products: IOrderProduct[];
}

export function OrderItems({ products }: OrderItemsProps) {
  return (
    <div className="flex flex-col divide-y">
      {products.map((item, index) => (
        <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
          {item.image ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md border">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-md border">
              <PackageIcon className="text-muted-foreground size-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-medium">
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
    </div>
  );
}
