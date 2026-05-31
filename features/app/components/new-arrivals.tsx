'use client';

import { ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetNewArrivals } from '@/features/app/hooks/use-get-new-arrivals';

export function NewArrivals() {
  const { data, isPending } = useGetNewArrivals(4);
  const products = data?.data?.items ?? [];

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="text-primary size-5" />
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                Just Arrived
              </span>
            </div>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">New Arrivals</h2>
            <p className="text-muted-foreground mt-2">
              Fresh styles added to our collection this week
            </p>
          </div>
          <Button variant="outline" className="h-9 w-fit cursor-pointer" asChild>
            <Link href="/shop?sort=newest">
              View All New <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden py-0">
                  <CardContent className="p-0">
                    <div className="bg-muted aspect-3/4 w-full animate-pulse" />
                    <div className="flex flex-col gap-2 p-4">
                      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                      <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : products.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug}`}>
                  <Card className="group overflow-hidden py-0 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-3/4 overflow-hidden">
                        <Image
                          src={product.media[0]?.path ?? ''}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-xs font-medium text-black">
                          New
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1.5 p-4">
                        <h3 className="line-clamp-1 text-sm font-medium">{product.name}</h3>
                        <p className="text-muted-foreground text-xs">{product.category?.name}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold">
                            ${product.selling_price.toFixed(2)}
                          </span>
                          {product.price > product.selling_price && (
                            <span className="text-muted-foreground text-xs line-through">
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
