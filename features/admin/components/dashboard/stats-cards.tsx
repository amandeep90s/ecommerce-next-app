'use client';

import { DollarSign, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Monthly Recurring Revenue',
    value: '$34.1K',
    change: '+6.1%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    title: 'Total Users',
    value: '500.1K',
    change: '+19.2%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    title: 'Total Orders',
    value: '12,463',
    change: '+8.5%',
    trend: 'up' as const,
    icon: ShoppingCart,
  },
  {
    title: 'User Growth',
    value: '11.3%',
    change: '-1.2%',
    trend: 'down' as const,
    icon: TrendingUp,
  },
];

export function StatsCards() {
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
