'use client';

import { type PaginationState } from '@tanstack/react-table';
import { PlusIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProductColumns } from '@/features/admin/components/product/product-columns';
import { ProductDataTable } from '@/features/admin/components/product/product-data-table';
import { useGetProducts } from '@/features/admin/hooks/use-get-products';

const PRODUCT_FILTERS = ['active', 'trashed'] as const;

export function ProductPageView() {
  const [{ filter, page, limit, q }, setParams] = useQueryStates({
    filter: parseAsStringLiteral(PRODUCT_FILTERS).withDefault('active'),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    q: parseAsString.withDefault(''),
  });

  // Local search input state for debouncing
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams({ q: searchInput || null, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading } = useGetProducts({ page, limit, q, filter });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit };

  function handlePaginationChange(
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1, limit: next.pageSize });
  }

  function handleFilterChange(value: string) {
    setParams({ filter: value as (typeof PRODUCT_FILTERS)[number], page: 1 });
    setSearchInput('');
  }

  const columns = useMemo(() => getProductColumns({ filter }), [filter]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-medium">Products</CardTitle>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <PlusIcon className="size-4" />
            Add Product
          </Link>
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Toolbar: tabs + search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={filter} onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="trashed">Trashed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search products…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Table */}
        <ProductDataTable
          columns={columns}
          data={items}
          meta={meta}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </CardContent>
    </Card>
  );
}
