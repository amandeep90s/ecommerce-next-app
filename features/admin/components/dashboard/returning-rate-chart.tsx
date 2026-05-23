'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'Feb', rate: 32 },
  { month: 'Mar', rate: 45 },
  { month: 'Apr', rate: 38 },
  { month: 'May', rate: 52 },
  { month: 'Jun', rate: 48 },
  { month: 'Jul', rate: 61 },
  { month: 'Aug', rate: 55 },
  { month: 'Oct', rate: 42 },
  { month: 'Dec', rate: 58 },
];

const chartConfig = {
  rate: {
    label: 'Returning Rate',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function ReturningRateChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Returning Rate</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">$42,379</span>
          <span className="flex items-center gap-0.5 text-xs text-emerald-500">
            <TrendingUp className="size-3" />
            +2.5%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rate" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
