'use client';

import { Card, CardContent } from '@/components/ui/card';

export function WelcomeBanner() {
  return (
    <Card className="bg-primary text-primary-foreground border-0">
      <CardContent className="flex items-center justify-between py-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Congratulations! 🎉</h2>
          <p className="text-primary-foreground/80 text-sm">Best seller of the month</p>
          <div className="mt-2">
            <span className="text-3xl font-bold">$15,231.89</span>
            <span className="text-primary-foreground/80 ml-2 text-sm">+65% from last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
