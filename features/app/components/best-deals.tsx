'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useGetFeaturedProducts } from '@/features/app/hooks/use-get-featured-products';

const MAX_ITEMS = 6;

export function BestDeals() {
  const { data, isPending } = useGetFeaturedProducts(MAX_ITEMS);
  const products = data?.data ?? [];

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-balance md:text-3xl">
          Today&apos;s Best Deals For You!
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6">
          {isPending
            ? Array.from({ length: MAX_ITEMS }).map((_, i) => (
                <Card
                  key={i}
                  className="flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none"
                >
                  <CardContent className="flex flex-1 flex-col gap-4 px-4">
                    <div className="bg-muted aspect-square w-full animate-pulse rounded-md" />
                    <div className="flex flex-col gap-2">
                      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                      <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : products.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none transition-shadow duration-300 hover:shadow-md"
                >
                  <CardContent className="flex flex-1 flex-col gap-4 px-4">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <Image
                        src={product.media[0]?.path ?? ''}
                        alt={product.name}
                        className="size-full rounded-md object-contain dark:brightness-[0.95] dark:invert"
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h2 className="mb-1 font-medium text-balance">{product.name}</h2>
                      <div className="mt-auto flex items-baseline gap-2">
                        <p className="font-semibold">${product.selling_price.toFixed(2)}</p>
                        {product.price > product.selling_price && (
                          <p className="text-muted-foreground text-sm line-through md:text-base xl:text-sm 2xl:text-base">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t-0 bg-transparent px-3 pt-0 md:px-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full cursor-pointer px-3 text-xs"
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
