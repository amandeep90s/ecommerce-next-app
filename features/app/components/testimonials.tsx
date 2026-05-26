'use client';

import { Star } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGetPublicReviews } from '@/features/app/hooks/use-get-public-reviews';
import { cn } from '@/lib/utils';

type EmblaEventType =
  | 'init'
  | 'pointerDown'
  | 'pointerUp'
  | 'scroll'
  | 'select'
  | 'settle'
  | 'destroy'
  | 'reInit'
  | 'resize';

type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: EmblaEventType, callback: () => void) => void;
  off: (event: EmblaEventType, callback: () => void) => void;
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={cn('size-4', index < Math.floor(rating) ? 'fill-foreground' : 'fill-none')}
      />
    ))}
    <span className="text-muted-foreground ms-2 text-sm">({rating})</span>
  </div>
);

export function Testimonials({ className }: { className?: string }) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const { data, isPending } = useGetPublicReviews(6);
  const reviews = data?.data ?? [];

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className={cn('py-12 lg:py-20', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-balance md:text-4xl">Our Clients Review</h2>
        </header>

        <Carousel
          className="w-full"
          setApi={(api) => {
            if (api) {
              setApi(api);
            } else {
              setApi(null);
            }
          }}
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent className="-ml-1">
            {isPending
              ? Array.from({ length: 3 }).map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-full px-4 last:pe-0 sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="border-border h-full overflow-hidden border py-6">
                      <CardHeader className="gap-0 px-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted size-12 animate-pulse rounded-full" />
                          <div className="flex flex-col gap-2">
                            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                            <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6">
                        <div className="bg-muted h-16 w-full animate-pulse rounded" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))
              : reviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className="basis-full px-4 last:pe-0 sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="border-border h-full overflow-hidden border py-6">
                      <CardHeader className="gap-0 px-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="bg-muted size-12">
                            <AvatarImage
                              src={review.user.avatar?.url ?? ''}
                              alt={review.user.name}
                              className="size-12"
                            />
                            <AvatarFallback className="bg-card">
                              {review.user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-foreground font-semibold">
                              {review.user.name}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6">
                        <p className="text-muted-foreground text-base">{review.comment}</p>
                      </CardContent>
                      <CardFooter className="border-t-0 bg-transparent px-6 pb-6">
                        <RatingStars rating={review.rating} />
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious variant="outline" className="hidden cursor-pointer lg:flex" />
          <CarouselNext variant="outline" className="hidden cursor-pointer lg:flex" />
          <div className="mt-8 flex items-center justify-center gap-2">
            {reviews.map((_, index) => (
              <Button
                variant="ghost"
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-9 px-4 py-2',
                  'size-2 cursor-pointer rounded-full p-0! transition-all',
                  current === index ? 'bg-foreground w-6' : 'bg-muted',
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index ? 'true' : 'false'}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
