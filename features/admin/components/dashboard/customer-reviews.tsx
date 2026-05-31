'use client';

import { Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RatingItem {
  stars: number;
  count: number;
}

export function CustomerReviews({ data }: { data?: RatingItem[] }) {
  const ratings = data || [
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const totalReviews = ratings.reduce((acc, r) => acc + r.count, 0);
  const averageRating = totalReviews
    ? ratings.reduce((acc, r) => acc + r.stars * r.count, 0) / totalReviews
    : 0;
  const maxCount = Math.max(...ratings.map((r) => r.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <p className="text-muted-foreground text-sm">
          Based on {totalReviews.toLocaleString()} verified purchases
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex flex-col">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-xs">out of 5</span>
          </div>
        </div>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating.stars} className="flex items-center gap-3 text-sm">
              <span className="flex w-8 items-center gap-0.5">
                {rating.stars} <Star className="size-3 fill-amber-400 text-amber-400" />
              </span>
              <Progress value={(rating.count / maxCount) * 100} className="h-2 flex-1" />
              <span className="text-muted-foreground w-12 text-right">
                {rating.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
