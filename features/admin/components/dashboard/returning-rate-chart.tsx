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

interface OrdersTrendItem {
  month: string;
  total: number;
  delivered: number;
}

const chartConfig = {
  total: {
    label: 'Total Orders',
    color: 'var(--chart-3)',
  },
  delivered: {
    label: 'Delivered',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

export function ReturningRateChart({ data }: { data?: OrdersTrendItem[] }) {
  const chartData = data || [];
  const totalOrders = chartData.reduce((acc, d) => acc + d.total, 0);
  const totalDelivered = chartData.reduce((acc, d) => acc + d.delivered, 0);
  const deliveryRate = totalOrders ? ((totalDelivered / totalOrders) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Overview</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{totalOrders} orders</span>
          <span className="flex items-center gap-0.5 text-xs text-emerald-500">
            <TrendingUp className="size-3" />
            {deliveryRate}% delivered
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
            <Bar dataKey="total" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="delivered" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
