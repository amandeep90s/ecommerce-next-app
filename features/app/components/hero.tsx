'use client';

import { ArrowRight, Flame, Search, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  trending: boolean;
  discount: string;
  tag: string;
}

const storeData = {
  title: 'Discover Your Perfect Style',
  subtitle:
    'Explore our curated collection of premium products. Each piece is handpicked for those who appreciate quality and style.',
  featuredProducts: [
    {
      id: 1,
      name: 'Classic Watch',
      image:
        'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/accessories.800w.900f12.avif',
      price: 299,
      rating: 4.9,
      reviews: 128,
      trending: true,
      tag: 'Best Seller',
    },
    {
      id: 2,
      name: 'Premium Headphones',
      image:
        'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/premium-headphones.500w.3281fb.avif',
      price: 199,
      rating: 4.8,
      reviews: 256,
      trending: true,
      discount: 'Free Shipping',
      tag: 'New Arrival',
    },
    {
      id: 3,
      name: 'Luxury Sunglasses',
      image:
        'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/luxury-sunglasses.500w.9ef2ef.avif',
      price: 159,
      rating: 4.7,
      reviews: 189,
      trending: true,
      discount: 'Limited Stock',
      tag: 'Premium',
    },
    {
      id: 4,
      name: 'Smart Watch Pro',
      image:
        'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/refurbished.500w.77e256.avif',
      price: 349,
      rating: 4.9,
      reviews: 312,
      trending: true,
      discount: 'Early Bird',
      tag: 'Featured',
    },
  ] as Product[],
};

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [api, setApi] = useState<{
    selectedScrollSnap: () => number;
    scrollTo: (index: number) => void;
  }>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % storeData.featuredProducts.length;
      api.scrollTo(nextSlide);
      setCurrentSlide(nextSlide);
    }, 5000);

    return () => clearInterval(interval);
  }, [api, currentSlide]);

  return (
    <section className="from-background to-accent/20 relative bg-linear-to-b">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <header className="flex flex-col gap-8">
            <Badge
              variant="outline"
              className="flex h-auto w-fit items-center gap-2 rounded-full px-4 py-2 font-semibold"
            >
              <TrendingUp className="size-4" />
              New Collection 2025
            </Badge>

            <h1 className="text-5xl leading-tight font-bold text-balance md:text-6xl lg:text-7xl">
              {storeData.title}
            </h1>

            <p className="text-muted-foreground max-w-lg text-xl text-balance">
              {storeData.subtitle}
            </p>

            <div className="relative max-w-md">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full pe-4 pl-12 text-lg"
                aria-label="Search products"
              />
              <Search className="text-muted-foreground absolute start-4 top-1/2 size-5 -translate-y-1/2" />
              <Button
                size="lg"
                className="absolute end-2 top-1/2 h-10 -translate-y-1/2 cursor-pointer rounded-full px-6"
              >
                Search
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button size="lg" className="h-10 cursor-pointer rounded-full px-4">
                Shop Now
                <ArrowRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-10 cursor-pointer justify-center rounded-full px-4"
              >
                <ShoppingBag />
                View Catalog
              </Button>
            </div>
          </header>

          <div className="flex flex-col gap-4">
            <div className="relative h-[500px] w-full border-0">
              <Carousel
                className="group size-full"
                setApi={setApi}
                opts={{
                  align: 'start',
                  loop: true,
                  duration: 20,
                  skipSnaps: true,
                }}
                onSelect={() => {
                  if (api) {
                    setCurrentSlide(api.selectedScrollSnap());
                  }
                }}
              >
                <CarouselContent className="h-full">
                  {storeData.featuredProducts.map((product) => (
                    <CarouselItem key={product.id} className="h-full">
                      <Card className="relative size-full overflow-hidden border-1 py-4">
                        <CardContent className="px-4">
                          <div className="relative size-full overflow-hidden rounded-md">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-[500px] w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="from-background/90 via-background/30 absolute inset-0 bg-linear-to-t to-transparent" />

                          <div className="text-background-foreground absolute inset-0 flex flex-col justify-end p-8">
                            <div className="relative z-10 flex max-w-md flex-col gap-4">
                              <Badge className="w-fit rounded-full px-2.5 py-0.5 font-semibold">
                                {product.tag}
                              </Badge>
                              <h2 className="text-4xl font-bold">{product.name}</h2>
                              <p className="text-background-foreground/80 text-lg">
                                Discover the latest in style and comfort with our premium
                                collection.
                              </p>
                              <div className="flex items-center gap-4 pt-2">
                                <Button size="lg" className="h-10 cursor-pointer rounded-full px-8">
                                  Shop Now
                                </Button>
                                <div className="text-foreground flex items-center gap-1">
                                  <Star className="fill-foreground size-5" />
                                  <span className="font-medium">{product.rating}</span>
                                  <span className="text-foreground/80">
                                    ({product.reviews} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {product.trending && (
                            <div className="text-background-foreground bg-foreground/10 dark:bg-background/20 absolute end-8 top-8 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-xs">
                              <Flame className="size-4" /> Trending
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Dots Navigation - Enhanced */}
            <div className="relative mt-8 flex justify-center gap-3">
              {storeData.featuredProducts.map((_, index) => (
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
