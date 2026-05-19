'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaFilter } from '@/types';

interface MediaFilterTabsProps {
  value: MediaFilter;
  onChange: (value: MediaFilter) => void;
}

export function MediaFilterTabs({ value, onChange }: MediaFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as MediaFilter)}>
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="trashed">Trashed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
