'use client';

import { type PaginationState } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrderColumns } from '@/features/admin/components/orders/order-columns';
import { OrderDataTable } from '@/features/admin/components/orders/order-data-table';
import { useGetAdminOrders } from '@/features/admin/hooks/use-admin-orders';

const ORDER_STATUS_FILTERS = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export function OrderPageView() {
  const [{ status, page, limit, q }, setParams] = useQueryStates({
    status: parseAsStringLiteral(ORDER_STATUS_FILTERS).withDefault('all'),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    q: parseAsString.withDefault(''),
  });

  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams({ q: searchInput || null, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading } = useGetAdminOrders({ page, limit, q, status });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit };

  function handlePaginationChange(
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1, limit: next.pageSize });
  }

  function handleStatusChange(value: string) {
    setParams({ status: value as (typeof ORDER_STATUS_FILTERS)[number], page: 1 });
    setSearchInput('');
  }

  const columns = useMemo(() => getOrderColumns(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Orders</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={status} onValueChange={handleStatusChange}>
            <TabsList>
              {ORDER_STATUS_FILTERS.map((s) => (
                <TabsTrigger key={s} value={s} className="capitalize">
                  {s}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search customer name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-xs pl-8"
            />
          </div>
        </div>

        <OrderDataTable
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
