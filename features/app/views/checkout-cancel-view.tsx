'use client';

import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CheckoutCancelView() {
  return (
    <div className="bg-muted/30">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30">
              <AlertCircle className="size-10 text-red-600" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-8">
            Your payment was cancelled. No charges have been made. You can try again or continue
            shopping.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild className="cursor-pointer">
              <Link href="/checkout">
                <ArrowLeft className="mr-2 size-4" />
                Return to Checkout
              </Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/shop">
                <ShoppingBag className="mr-2 size-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
