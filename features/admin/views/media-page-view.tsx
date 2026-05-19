'use client';

import { useCallback, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DeleteMedia } from '@/features/admin/components/media/delete-media';
import { MediaGrid } from '@/features/admin/components/media/media-grid';
import { UploadMedia } from '@/features/admin/components/media/upload-media';
import { useGetMedia } from '@/features/admin/hooks/use-get-media';

export function MediaPageView() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data, isLoading } = useGetMedia();

  const items = data?.data ?? [];

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-medium">Media Library</CardTitle>

        <div className="flex items-center gap-4">
          <UploadMedia />
          <DeleteMedia selectedIds={selectedIds} onSuccess={handleDeleteSuccess} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent>
        <MediaGrid
          items={items}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggle={handleToggle}
        />
      </CardContent>
    </Card>
  );
}
