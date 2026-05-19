'use client';

import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useCallback, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DeleteMedia } from '@/features/admin/components/media/delete-media';
import { MediaFilterTabs } from '@/features/admin/components/media/media-filter';
import { MediaGrid } from '@/features/admin/components/media/media-grid';
import { MediaPagination } from '@/features/admin/components/media/media-pagination';
import { PermanentDeleteMedia } from '@/features/admin/components/media/permanent-delete-media';
import { RestoreMedia } from '@/features/admin/components/media/restore-media';
import { UploadMedia } from '@/features/admin/components/media/upload-media';
import { useGetMedia } from '@/features/admin/hooks/use-get-media';
import { MediaFilter } from '@/types';

const LIMIT = 20;
const MEDIA_FILTERS = ['active', 'trashed'] as const;

export function MediaPageView() {
  const [{ filter, page }, setParams] = useQueryStates({
    filter: parseAsStringLiteral(MEDIA_FILTERS).withDefault('active'),
    page: parseAsInteger.withDefault(1),
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useGetMedia({ filter: filter as MediaFilter, page, limit: LIMIT });

  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function handleFilterChange(newFilter: MediaFilter) {
    setParams({ filter: newFilter, page: 1 });
    setSelectedIds(new Set());
  }

  function handlePageChange(newPage: number) {
    setParams({ page: newPage });
    setSelectedIds(new Set());
  }

  function handleActionSuccess() {
    setSelectedIds(new Set());
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-medium">Media Library</CardTitle>

        <div className="flex items-center gap-4">
          {filter === 'active' ? (
            <>
              <UploadMedia />
              <DeleteMedia selectedIds={selectedIds} onSuccess={handleActionSuccess} />
            </>
          ) : (
            <>
              <RestoreMedia selectedIds={selectedIds} onSuccess={handleActionSuccess} />
              <PermanentDeleteMedia selectedIds={selectedIds} onSuccess={handleActionSuccess} />
            </>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col gap-4">
        <MediaFilterTabs value={filter as MediaFilter} onChange={handleFilterChange} />

        <MediaGrid
          items={items}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          filter={filter as MediaFilter}
        />

        {meta && <MediaPagination meta={meta} onPageChange={handlePageChange} />}
      </CardContent>
    </Card>
  );
}
