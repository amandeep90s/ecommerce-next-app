'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
  id: string;
  status: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-[var(--chart-1)]',
  processing: 'bg-[var(--chart-2)]',
  shipped: 'bg-[var(--chart-3)]',
  delivered: 'bg-[var(--chart-4)]',
  cancelled: 'bg-[var(--chart-5)]',
};

export function StoreVisits({ data }: { data?: OrderItem[] }) {
  const orders = data || [];
  const total = orders.length;

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sources = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    percentage: total ? Math.round((count / total) * 100) : 0,
    color: statusColors[status] || 'bg-[var(--chart-1)]',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Breakdown</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-muted-foreground text-sm">Recent Orders</span>
        </div>
      </CardHeader>
      <CardContent>
        {sources.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">No orders yet</p>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
