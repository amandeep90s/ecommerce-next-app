'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LocationItem {
  location: string;
  total: number;
  percentage: number;
}

export function SalesByLocation({ data }: { data?: LocationItem[] }) {
  const locations = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Location</CardTitle>
        <CardDescription>Top regions by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">No sales data yet</p>
          ) : (
            locations.map((location) => (
              <div key={location.location} className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium">{location.location}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    <span className="text-muted-foreground">
                      ${location.total.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-2">{location.percentage}%</span>
                  </span>
                </div>
                <Progress value={location.percentage} className="h-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
