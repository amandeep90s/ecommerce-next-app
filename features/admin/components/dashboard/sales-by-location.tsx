'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const locations = [
  { country: 'Canada', change: '+5.2%', trend: 'up' as const, percentage: 85 },
  { country: 'Greenland', change: '+7.8%', trend: 'up' as const, percentage: 80 },
  { country: 'Russia', change: '-2.1%', trend: 'down' as const, percentage: 63 },
  { country: 'China', change: '+3.4%', trend: 'up' as const, percentage: 60 },
  { country: 'Australia', change: '+1.2%', trend: 'up' as const, percentage: 45 },
  { country: 'Greece', change: '+1%', trend: 'up' as const, percentage: 40 },
];

export function SalesByLocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Location</CardTitle>
        <CardDescription>Income in the last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.country} className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-medium">{location.country}</span>
                <span className="flex shrink-0 items-center gap-1">
                  {location.trend === 'up' ? (
                    <TrendingUp className="size-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="size-3 text-red-500" />
                  )}
                  <span className={location.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                    {location.change}
                  </span>
                  <span className="text-muted-foreground ml-2">{location.percentage}%</span>
                </span>
              </div>
              <Progress value={location.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
