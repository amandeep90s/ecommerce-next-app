'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sources = [
  { name: 'Direct', percentage: 35, color: 'bg-[var(--chart-1)]' },
  { name: 'Social', percentage: 25, color: 'bg-[var(--chart-2)]' },
  { name: 'Email', percentage: 20, color: 'bg-[var(--chart-3)]' },
  { name: 'Referrals', percentage: 12, color: 'bg-[var(--chart-4)]' },
  { name: 'Other', percentage: 8, color: 'bg-[var(--chart-5)]' },
];

export function StoreVisits() {
  const total = 10200;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Visits by Source</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{total.toLocaleString()}</span>
          <span className="text-muted-foreground text-sm">Visitors</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex h-3 overflow-hidden rounded-full">
          {sources.map((source) => (
            <div
              key={source.name}
              className={`${source.color} transition-all`}
              style={{ width: `${source.percentage}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sources.map((source) => (
            <div key={source.name} className="flex items-center gap-2 text-sm">
              <div className={`size-2.5 rounded-full ${source.color}`} />
              <span className="text-muted-foreground">{source.name}</span>
              <span className="ml-auto font-medium">{source.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
