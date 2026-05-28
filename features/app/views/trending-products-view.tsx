'use client';

import { PackageSearch } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ProductCard } from '@/features/app/components/catalog/product-card';
import { ProductCardSkeleton } from '@/features/app/components/catalog/product-card-skeleton';
import { useGetTrendingProducts } from '@/features/app/hooks/use-get-trending-products';

const SKELETON_COUNT = 8;

export function TrendingProductsView() {
  const { data, isLoading } = useGetTrendingProducts(16);
  const products = data?.data ?? [];

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Trending Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            The most popular products our customers are loving right now.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Empty className="min-h-60 border">
            <EmptyHeader>
              <EmptyMedia>
                <PackageSearch className="text-muted-foreground size-10" />
              </EmptyMedia>
              <EmptyTitle>No trending products</EmptyTitle>
              <EmptyDescription>Check back soon for the latest trending items.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
