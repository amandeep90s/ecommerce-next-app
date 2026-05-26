'use client';

import { type PaginationState } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getNewsletterColumns } from '@/features/admin/components/newsletter/newsletter-columns';
import { NewsletterDataTable } from '@/features/admin/components/newsletter/newsletter-data-table';
import { useGetNewsletterSubscribers } from '@/features/admin/hooks/use-get-newsletter-subscribers';

export function NewsletterPageView() {
  const [{ page, limit, q }, setParams] = useQueryStates({
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

  const { data, isLoading } = useGetNewsletterSubscribers({ page, limit, q });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit };

  function handlePaginationChange(
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1, limit: next.pageSize });
  }

  const columns = useMemo(() => getNewsletterColumns(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Newsletter Subscribers</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Toolbar: search */}
        <div className="flex items-center justify-end">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search by email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <NewsletterDataTable
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
