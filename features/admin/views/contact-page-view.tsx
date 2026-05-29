'use client';

import { type PaginationState } from '@tanstack/react-table';
import { SearchIcon } from 'lucide-react';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getContactColumns } from '@/features/admin/components/contact/contact-columns';
import { ContactDataTable } from '@/features/admin/components/contact/contact-data-table';
import { useGetContactSubmissions } from '@/features/admin/hooks/use-get-contact-submissions';

const STATUS_OPTIONS = ['all', 'new', 'read', 'replied'] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

export function ContactPageView() {
  const [{ page, limit, q, status }, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    q: parseAsString.withDefault(''),
    status: parseAsStringLiteral(STATUS_OPTIONS).withDefault('all'),
  });

  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams({ q: searchInput || null, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data, isLoading } = useGetContactSubmissions({
    page,
    limit,
    q,
    status: status === 'all' ? '' : status,
  });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize: limit };

  function handlePaginationChange(
    updater: PaginationState | ((prev: PaginationState) => PaginationState),
  ) {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setParams({ page: next.pageIndex + 1, limit: next.pageSize });
  }

  const columns = useMemo(() => getContactColumns(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Contact Submissions</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Toolbar: search + status filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name, email, subject…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => setParams({ status: v as StatusOption, page: 1 })}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ContactDataTable
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
