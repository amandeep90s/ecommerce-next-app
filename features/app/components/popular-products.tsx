'use client';

import Image from 'next/image';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useGetTrendingProducts } from '@/features/app/hooks/use-get-trending-products';

export function PopularProducts() {
  const { data, isPending } = useGetTrendingProducts(3);
  const products = data?.data ?? [];

  return (
    <section className="py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-balance sm:text-4xl">Popular Products</h2>
          <p className="text-muted-foreground max-w-[60ch] text-balance">
            This beloved product has become a favorite among our customers for its exceptional
            features and unparalleled performance
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="flex flex-col gap-4">
                    <div className="bg-muted aspect-square w-full animate-pulse rounded-md" />
                    <div className="flex flex-col gap-2">
                      <div className="bg-muted h-5 w-2/3 animate-pulse rounded" />
                      <div className="bg-muted h-5 w-1/3 animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardContent className="flex flex-col gap-4">
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={product.media[0]?.path ?? ''}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <CardTitle className="line-clamp-1 text-lg font-semibold text-balance sm:text-xl">
                        {product.name}
                      </CardTitle>
                      <p className="text-lg font-semibold sm:text-xl">
                        ${product.selling_price.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
