'use client';

import { setPage } from '@/features/app/catalogSlice';
import { CatalogFilters } from '@/features/app/components/catalog/catalog-filters';
import { CatalogGrid } from '@/features/app/components/catalog/catalog-grid';
import { useGetShopProducts } from '@/features/app/hooks/use-get-shop-products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function ShopView() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.catalog);

  const { data, isLoading, isFetching } = useGetShopProducts(filters);
  const products = data?.data?.items ?? [];
  const meta = data?.data?.meta ?? null;

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
          {meta && (
            <p className="text-muted-foreground mt-1 text-sm">
              {meta.total} {meta.total === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CatalogFilters filters={filters} />
        </div>

        {/* Product grid */}
        <CatalogGrid
          products={products}
          meta={meta}
          isLoading={isLoading}
          isFetching={isFetching}
          page={filters.page}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      </div>
    </section>
  );
}
