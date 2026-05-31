'use client';

import { CheckCircle, Loader2, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IOrder } from '@/types';

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const response = await fetchWithAuth(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data.order);
        } else {
          setError(data.message || 'Failed to verify payment');
        }
      } catch {
        setError('Something went wrong while verifying your payment');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="bg-muted/30">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <Loader2 className="text-primary size-12 animate-spin" />
          <p className="text-muted-foreground mt-4">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!sessionId || error) {
    return (
      <div className="bg-muted/30">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Payment Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{error ?? 'No session ID found'}</p>
            <Button asChild className="cursor-pointer">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
              <CheckCircle className="size-10 text-green-600" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ve received your payment and your order is being
            processed.
          </p>
        </div>

        {order && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Order ID</p>
                  <p className="font-mono text-sm font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p className="text-sm font-medium capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Amount</p>
                  <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Payment Status</p>
                  <p className="text-sm font-medium capitalize">{order.paymentStatus}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-sm font-medium">Items</h3>
                <div className="flex flex-col gap-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>
                        {product.name} × {product.quantity}
                      </span>
                      <span className="font-medium">
                        ${(product.selling_price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.shippingAddress && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Shipping Address</h3>
                    <p className="text-muted-foreground text-sm">{order.shippingAddress.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {order.shippingAddress.address_line1}
                    </p>
                    {order.shippingAddress.address_line2 && (
                      <p className="text-muted-foreground text-sm">
                        {order.shippingAddress.address_line2}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postal_code}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild className="cursor-pointer">
            <Link href="/orders">
              <Package className="mr-2 size-4" />
              View My Orders
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
  );
}
