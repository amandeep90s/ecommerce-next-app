'use client';

import { Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWishlist, useRemoveFromWishlist } from '@/features/customer/hooks/use-wishlist';

export function WishlistView() {
  const { data, isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  // Filter out entries where the product was deleted or failed to populate
  const products = (data?.data ?? []).filter((item) => item.productId != null);

  function handleRemove(productId: string, productName: string) {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => toast.success(`${productName} removed from wishlist`),
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Wishlist</h1>

      {products.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16">
          <Heart className="text-muted-foreground size-16" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Button asChild>
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => {
            const product = item.productId;
            const imageUrl = product.media[0]?.path ?? '/images/placeholder.png';
            const hasDiscount = product.discount > 0;

            return (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/shop/${product.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {hasDiscount && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-col gap-2 p-3">
                    <p className="text-muted-foreground truncate text-xs">
                      {product.category.name}
                    </p>
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="line-clamp-2 text-sm font-medium hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold">
                          ${product.selling_price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-muted-foreground text-xs line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemove(product.id, product.name)}
                        disabled={removeFromWishlist.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
