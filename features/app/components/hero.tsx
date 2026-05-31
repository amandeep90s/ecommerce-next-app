'use client';

import { ArrowRight, Flame, ShoppingBag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useGetFeaturedProducts } from '@/features/app/hooks/use-get-featured-products';

export function Hero() {
  const [api, setApi] = useState<{
    selectedScrollSnap: () => number;
    scrollTo: (index: number) => void;
  }>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isPending } = useGetFeaturedProducts(4);
  const featuredProducts = data?.data ?? [];

  useEffect(() => {
    if (!api || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % featuredProducts.length;
      api.scrollTo(nextSlide);
      setCurrentSlide(nextSlide);
    }, 5000);

    return () => clearInterval(interval);
  }, [api, currentSlide, featuredProducts.length]);

  return (
    <section className="from-background to-accent/20 relative bg-linear-to-b">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <header className="flex flex-col gap-8">
            <Badge
              variant="outline"
              className="flex h-auto w-fit items-center gap-2 rounded-full px-4 py-2 font-semibold"
            >
              <Sparkles className="size-4" />
              New Arrivals Weekly
            </Badge>

            <h1 className="text-5xl leading-tight font-bold text-balance md:text-6xl lg:text-7xl">
              Elevate Your Everyday Style
            </h1>

            <p className="text-muted-foreground max-w-lg text-xl text-balance">
              Premium fashion for men and women. From casual essentials to statement pieces — find
              what makes you feel confident.
            </p>

            <div className="flex items-center gap-4">
              <Button size="lg" className="h-12 cursor-pointer rounded-full px-6" asChild>
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 cursor-pointer rounded-full px-6"
                asChild
              >
                <Link href="/collections">
                  <ShoppingBag className="mr-1" />
                  Collections
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-green-500" />
                Free Shipping over $75
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-500" />
                Easy Returns
              </span>
            </div>
          </header>

          <div className="flex flex-col gap-4">
            <div className="relative h-[500px] w-full border-0">
              <Carousel
                className="group size-full"
                setApi={setApi}
                opts={{ align: 'start', loop: true, duration: 20, skipSnaps: true }}
                onSelect={() => {
                  if (api) setCurrentSlide(api.selectedScrollSnap());
                }}
              >
                <CarouselContent className="h-full">
                  {isPending
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <CarouselItem key={i} className="h-full">
                          <Card className="relative size-full overflow-hidden border py-4">
                            <CardContent className="px-4">
                              <div className="bg-muted h-[500px] w-full animate-pulse rounded-md" />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))
                    : featuredProducts.map((product) => (
                        <CarouselItem key={product.id} className="h-full">
                          <Link href={`/shop/${product.slug}`} className="block h-full">
                            <Card className="relative size-full overflow-hidden border py-4">
                              <CardContent className="px-4">
                                <div className="relative size-full overflow-hidden rounded-md">
                                  <Image
                                    src={product.media[0]?.path ?? ''}
                                    alt={product.name}
                                    width={1200}
                                    height={500}
                                    className="h-[500px] w-full object-cover"
                                  />
                                </div>
                                <div className="from-background/90 via-background/30 absolute inset-0 bg-linear-to-t to-transparent" />

                                <div className="text-background-foreground absolute inset-0 flex flex-col justify-end p-8">
                                  <div className="relative z-10 flex max-w-md flex-col gap-3">
                                    <Badge className="w-fit rounded-full px-2.5 py-0.5 font-semibold">
                                      {product.discount > 0
                                        ? `${product.discount}% Off`
                                        : 'Featured'}
                                    </Badge>
                                    <h2 className="text-3xl font-bold">{product.name}</h2>
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl font-bold">
                                        ${product.selling_price.toFixed(2)}
                                      </span>
                                      {product.price > product.selling_price && (
                                        <span className="text-lg line-through opacity-60">
                                          ${product.price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {product.isTrending && (
                                  <div className="text-background-foreground bg-foreground/10 dark:bg-background/20 absolute top-8 right-8 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-xs">
                                    <Flame className="size-4" /> Trending
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Dots Navigation */}
            <div className="relative mt-8 flex justify-center gap-3">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    api?.scrollTo(index);
                    setCurrentSlide(index);
                  }}
                  className={`relative size-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary' : 'bg-foreground/20 hover:bg-foreground/40'}`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index ? 'step' : undefined}
                >
                  {currentSlide === index && (
                    <span className="absolute inset-0 m-auto rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
