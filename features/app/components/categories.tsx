'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetPublicCategories } from '@/features/app/hooks/use-get-public-categories';

export function HomeCategories() {
  const { data, isPending } = useGetPublicCategories();
  const categories = data?.data ?? [];

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">Shop by Category</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Discover products across our most popular categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden py-0">
                  <div className="bg-muted aspect-5/4 animate-pulse" />
                </Card>
              ))
            : categories.map((category) => (
                <Link key={category.id} href={`/collections/${category.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden py-0 transition-all duration-500 hover:shadow-lg">
                    <div className="relative aspect-5/4 overflow-hidden">
                      {category.image?.path ? (
                        <Image
                          src={category.image.path}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="bg-muted size-full" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Info Overlay */}
                      <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                        <h3 className="mb-1 text-xl font-bold">{category.name}</h3>
                        <p className="mb-3 text-sm text-white/90">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 cursor-pointer border-white/30 bg-white/20 px-3 text-xs text-white backdrop-blur-sm hover:bg-white/30"
                          >
                            Browse
                            <ArrowRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Button size="lg" className="h-10 cursor-pointer gap-2 px-4" asChild>
            <Link href="/shop">
              <ShoppingBag className="size-5" />
              View All Categories
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
