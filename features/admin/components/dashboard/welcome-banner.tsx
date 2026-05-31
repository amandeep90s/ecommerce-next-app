'use client';

import { Card, CardContent } from '@/components/ui/card';

interface WelcomeBannerData {
  totalRevenue: number;
  revenueChange: string;
  totalProducts: number;
}

export function WelcomeBanner({ data }: { data?: WelcomeBannerData }) {
  const revenue = data?.totalRevenue || 0;
  const change = data?.revenueChange || '0';
  const formattedRevenue = revenue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <Card className="bg-primary text-primary-foreground border-0">
      <CardContent className="flex items-center justify-between py-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome back! 🎉</h2>
          <p className="text-primary-foreground/80 text-sm">
            Total lifetime revenue across {data?.totalProducts || 0} products
          </p>
          <div className="mt-2">
            <span className="text-3xl font-bold">{formattedRevenue}</span>
            <span className="text-primary-foreground/80 ml-2 text-sm">
              {parseFloat(change) >= 0 ? '+' : ''}
              {change}% this month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
