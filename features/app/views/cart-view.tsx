'use client';

import {
  CreditCard,
  Minus,
  MoveRight,
  Package,
  Plus,
  Shield,
  ShoppingBag,
  Store,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  clearCart,
  removeFromCart,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/features/app/cartSlice';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 15.99;

export function CartView() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  const savings = items.reduce(
    (sum, item) => sum + (item.price - item.selling_price) * item.quantity,
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : items.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your Shopping Cart</h1>
        <p className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart •{' '}
          <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          {/* Cart Items */}
          {items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="text-muted-foreground/50 mb-4 size-12" />
                <h3 className="text-lg font-medium">Your cart is empty</h3>
                <p className="text-muted-foreground mt-1 text-sm">Add some items to get started</p>
                <Button asChild className="mt-4 h-9 cursor-pointer px-4 py-2" variant="outline">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {items.map((item) => (
                <Card key={item.productId} className="gap-0 overflow-hidden py-0">
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="flex h-auto w-full items-center sm:w-40"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={160}
                        height={144}
                        className="h-30 w-full object-contain object-center"
                      />
                    </Link>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="text-foreground text-lg font-medium hover:underline">
                              {item.name}
                            </h3>
                          </Link>
                          {item.discount > 0 && (
                            <p className="text-muted-foreground mt-1 text-sm">
                              {item.discount}% off
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8 cursor-pointer"
                          onClick={() => dispatch(removeFromCart(item.productId))}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                }),
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 cursor-pointer"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus />
                          </Button>
                        </div>

                        <div className="text-end">
                          <p className="text-lg font-semibold">
                            ${(item.selling_price * item.quantity).toFixed(2)}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-muted-foreground text-xs line-through">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardFooter className="bg-muted/20 border-t px-4 py-2!">
                    <div className="text-muted-foreground flex items-center text-sm">
                      <Package className="me-2 size-4" />
                      <span>
                        {item.stock > 0
                          ? `${item.stock} in stock`
                          : 'Out of stock — remove to continue'}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* Clear cart */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-8 cursor-pointer text-xs"
                  onClick={() => dispatch(clearCart())}
                >
                  <Trash2 className="mr-1 size-3" />
                  Clear cart
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex w-full flex-col gap-4 lg:w-96">
          <Card className="sticky top-4 gap-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Free shipping progress */}
              {items.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Add{' '}
                  <span className="font-semibold">
                    ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                  </span>{' '}
                  more to get free shipping!
                </div>
              )}
              {items.length > 0 && subtotal >= FREE_SHIPPING_THRESHOLD && (
                <div className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-950 dark:text-green-300">
                  You qualify for free shipping!
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={cn(shipping === 0 && items.length > 0 ? 'text-green-600' : '')}>
                    {items.length === 0 ? '—' : shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm font-medium text-green-600">
                    <span>You Save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <div className="text-end">
                  <p className="text-xl font-bold">${total.toFixed(2)}</p>
                  <p className="text-muted-foreground text-xs">including VAT, if applicable</p>
                </div>
              </div>

              {items.length > 0 ? (
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'mt-4 w-full text-base font-medium',
                  )}
                >
                  <ShoppingBag />
                  Proceed to Checkout
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="mt-4 w-full cursor-pointer text-base font-medium"
                  disabled
                >
                  <ShoppingBag />
                  Proceed to Checkout
                </Button>
              )}

              <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                <CreditCard className="size-3.5" />
                <span>Secure payment with SSL encryption</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed py-4">
            <CardContent className="px-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium">Secure Checkout</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="h-9 w-full cursor-pointer px-4 py-2">
            <Link href="/shop">
              <Store />
              Continue Shopping
              <MoveRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
