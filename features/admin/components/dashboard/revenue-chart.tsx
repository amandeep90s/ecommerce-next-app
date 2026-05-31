'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface RevenueChartItem {
  month: string;
  revenue: number;
  orders: number;
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
  orders: {
    label: 'Orders',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data?: RevenueChartItem[] }) {
  const chartData = data || [];
  const totalRevenue = chartData.reduce((acc, d) => acc + d.revenue, 0);
  const totalOrders = chartData.reduce((acc, d) => acc + d.orders, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>Income in the last 6 months</CardDescription>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="bg-chart-1 size-2.5 rounded-full" />
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-chart-2 size-2.5 rounded-full" />
            <span className="text-muted-foreground">Orders</span>
            <span className="font-medium">{totalOrders.toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <Area
              dataKey="orders"
              type="monotone"
              fill="url(#fillOrders)"
              stroke="var(--chart-2)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
