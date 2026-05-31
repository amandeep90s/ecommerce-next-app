'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useGetTrendingProducts } from '@/features/app/hooks/use-get-trending-products';

export function PopularProducts() {
  const { data, isPending } = useGetTrendingProducts(3);
  const products = data?.data ?? [];

  return (
    <section className="py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">Trending Now</h2>
            <p className="text-muted-foreground mt-2 max-w-[60ch] text-balance">
              Our most popular picks this week — loved by customers for their quality and style
            </p>
          </div>
          <Button variant="outline" className="h-9 w-fit cursor-pointer" asChild>
            <Link href="/trending">
              View All <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
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
                <Link key={product.id} href={`/shop/${product.slug}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg">
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
                        <p className="text-muted-foreground text-sm">{product.category?.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold sm:text-xl">
                            ${product.selling_price.toFixed(2)}
                          </span>
                          {product.price > product.selling_price && (
                            <span className="text-muted-foreground text-sm line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
