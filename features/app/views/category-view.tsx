'use client';

import { ChevronDown, FolderX, Search, SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { CatalogSortOption } from '@/features/app/catalogSlice';
import { CatalogGrid } from '@/features/app/components/catalog/catalog-grid';
import { useGetCategoryBySlug } from '@/features/app/hooks/use-get-category-by-slug';
import { useGetCategoryProducts } from '@/features/app/hooks/use-get-category-products';

interface CategoryViewProps {
  slug: string;
}

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $25', min: '', max: '25' },
  { label: '$25 – $50', min: '25', max: '50' },
  { label: '$50 – $100', min: '50', max: '100' },
  { label: 'Over $100', min: '100', max: '' },
] as const;

const SORT_OPTIONS: { id: CatalogSortOption; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

const SORT_IDS = SORT_OPTIONS.map((s) => s.id) as [CatalogSortOption, ...CatalogSortOption[]];

export function CategoryView({ slug }: CategoryViewProps) {
  const { category, isLoading: categoryLoading } = useGetCategoryBySlug(slug);

  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringLiteral(SORT_IDS).withDefault('featured'),
    priceMin: parseAsString.withDefault(''),
    priceMax: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  });

  // Debounced local search state
  const [localSearch, setLocalSearch] = useState(params.q);

  // Sync local search when params.q changes externally (e.g. clear)
  const [prevQ, setPrevQ] = useState(params.q);
  if (params.q !== prevQ) {
    setPrevQ(params.q);
    setLocalSearch(params.q);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== params.q) {
        void setParams({ q: localSearch || null, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, params.q, setParams]);

  const {
    data,
    isLoading: productsLoading,
    isFetching,
  } = useGetCategoryProducts(
    {
      categoryId: category?.id ?? '',
      search: params.q,
      sort: params.sort,
      page: params.page,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
    },
    !categoryLoading && Boolean(category),
  );

  const products = data?.data?.items ?? [];
  const meta = data?.data?.meta ?? null;

  const selectedSort = SORT_OPTIONS.find((s) => s.id === params.sort) ?? SORT_OPTIONS[0];
  const selectedPriceRange =
    PRICE_RANGES.find((r) => r.min === params.priceMin && r.max === params.priceMax) ??
    PRICE_RANGES[0];

  type ActiveFilter = { type: string; label: string };
  const activeFilters: ActiveFilter[] = [];
  if (params.q) activeFilters.push({ type: 'search', label: `"${params.q}"` });
  if (selectedPriceRange !== PRICE_RANGES[0])
    activeFilters.push({ type: 'price', label: selectedPriceRange.label });

  function clearFilter(type: string) {
    if (type === 'search') {
      setLocalSearch('');
      void setParams({ q: null, page: 1 });
    }
    if (type === 'price') void setParams({ priceMin: null, priceMax: null, page: 1 });
  }

  function clearAll() {
    setLocalSearch('');
    void setParams({ q: null, priceMin: null, priceMax: null, sort: null, page: 1 });
  }

  // After loading resolves with no matching category, show a dedicated not-found state
  // so invalid slugs never render filters or a contradictory empty-products grid.
  if (!categoryLoading && !category) {
    return (
      <section className="py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-lg border border-dashed text-center">
            <FolderX className="text-muted-foreground size-12" />
            <div>
              <h1 className="text-xl font-semibold">Collection not found</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                The collection &quot;{slug}&quot; doesn&apos;t exist or has been removed.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/shop">Browse all products</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="mb-8">
          {categoryLoading ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Skeleton className="size-20 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              {category!.image?.path && (
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={category!.image.path}
                    alt={category!.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{category!.name}</h1>
                {category!.description && (
                  <p className="text-muted-foreground mt-1 text-sm">{category!.description}</p>
                )}
                {meta && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {meta.total} {meta.total === 1 ? 'product' : 'products'} found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Row 1: Search + Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search in this category…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-9 pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 w-full cursor-pointer sm:w-auto">
                  <SlidersHorizontal data-icon="inline-start" />
                  Sort: {selectedSort.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => void setParams({ sort: option.id, page: 1 })}
                    className={params.sort === option.id ? 'bg-accent' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Row 2: Price filter */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 cursor-pointer px-3 text-xs">
                  {selectedPriceRange.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {PRICE_RANGES.map((range) => (
                  <DropdownMenuItem
                    key={range.label}
                    onClick={() =>
                      void setParams({
                        priceMin: range.min || null,
                        priceMax: range.max || null,
                        page: 1,
                      })
                    }
                    className={selectedPriceRange.label === range.label ? 'bg-accent' : ''}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">Active filters:</span>
              {activeFilters.map((f) => (
                <Badge key={f.type} variant="secondary" className="gap-1 pr-1.5">
                  {f.label}
                  <button
                    type="button"
                    onClick={() => clearFilter(f.type)}
                    className="hover:text-destructive ml-0.5 rounded-full"
                    aria-label={`Remove ${f.label} filter`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground h-7 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <CatalogGrid
          products={products}
          meta={meta}
          isLoading={categoryLoading || productsLoading}
          isFetching={isFetching}
          page={params.page}
          onPageChange={(p) => void setParams({ page: p })}
        />
      </div>
    </section>
  );
}
