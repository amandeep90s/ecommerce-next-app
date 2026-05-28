import { Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import type { IReviewItem } from '@/types';

interface ReviewCardProps {
  review: IReviewItem;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'size-3.5',
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted',
          )}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const user = review.user;
  const avatarUrl = typeof user !== 'string' ? user.avatar?.url : undefined;
  const userName = typeof user !== 'string' ? user.name : 'Anonymous';

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <StarRating rating={review.rating} />
          <span className="text-muted-foreground shrink-0 text-xs">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        {review.title && <p className="text-sm font-semibold">{review.title}</p>}
        <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
          {review.comment}
        </p>

        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
