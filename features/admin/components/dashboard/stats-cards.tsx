'use client';

import { DollarSign, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatData {
  revenue: { value: number; change: string; trend: 'up' | 'down' };
  users: { value: number; change: string; trend: 'up' | 'down' };
  orders: { value: number; change: string; trend: 'up' | 'down' };
  userGrowth: { value: string; change: string; trend: 'up' | 'down' };
}

function formatValue(value: number, prefix = '') {
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K`;
  return `${prefix}${value}`;
}

export function StatsCards({ data }: { data?: StatData }) {
  const stats = [
    {
      title: 'Monthly Revenue',
      value: data ? formatValue(data.revenue.value, '$') : '$0',
      change: data
        ? `${parseFloat(data.revenue.change) >= 0 ? '+' : ''}${data.revenue.change}%`
        : '0%',
      trend: data?.revenue.trend || ('up' as const),
      icon: DollarSign,
    },
    {
      title: 'Total Users',
      value: data ? formatValue(data.users.value) : '0',
      change: data ? `${parseFloat(data.users.change) >= 0 ? '+' : ''}${data.users.change}%` : '0%',
      trend: data?.users.trend || ('up' as const),
      icon: Users,
    },
    {
      title: 'Total Orders',
      value: data ? data.orders.value.toLocaleString() : '0',
      change: data
        ? `${parseFloat(data.orders.change) >= 0 ? '+' : ''}${data.orders.change}%`
        : '0%',
      trend: data?.orders.trend || ('up' as const),
      icon: ShoppingCart,
    },
    {
      title: 'User Growth',
      value: data ? `${data.userGrowth.value}%` : '0%',
      change: data
        ? `${parseFloat(data.userGrowth.change) >= 0 ? '+' : ''}${data.userGrowth.change}%`
        : '0%',
      trend: data?.userGrowth.trend || ('up' as const),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="size-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="size-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
