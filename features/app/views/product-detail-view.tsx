'use client';

import { ChevronLeft, Minus, PackageSearch, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { addToCart } from '@/features/app/cartSlice';
import { ProductImageGallery } from '@/features/app/components/catalog/product-image-gallery';
import { ReviewCard } from '@/features/app/components/catalog/review-card';
import { useGetProductBySlug } from '@/features/app/hooks/use-get-product-by-slug';
import { useGetProductReviews } from '@/features/app/hooks/use-get-product-reviews';
import { useAppDispatch } from '@/store/hooks';

interface ProductDetailViewProps {
  slug: string;
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

function AverageStarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  );
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductBySlug(slug);
  const product = productData?.data ?? null;

  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviews(
    product?.id ?? '',
    20,
  );
  const reviews = reviewsData?.data ?? [];

  const hasDiscount = (product?.discount ?? 0) > 0;
  const isOutOfStock = (product?.stock ?? 0) === 0;
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product?.stock ?? 1, q + 1));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/shop"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Back to Shop
      </Link>

      {productLoading && <ProductDetailSkeleton />}

      {!productLoading && (productError || !product) && (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-lg border">
          <PackageSearch className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">Product not found.</p>
          <Button variant="outline" asChild>
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </div>
      )}

      {!productLoading && product && (
        <>
          {/* Product section */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Image gallery */}
            <ProductImageGallery images={product.media} productName={product.name} />

            {/* Product info */}
            <div className="flex flex-col gap-4">
              {/* Category */}
              <Link
                href={`/shop?category=${product.category.id}`}
                className="text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
              >
                {product.category.name}
              </Link>

              {/* Name */}
              <h1 className="text-3xl leading-tight font-bold">{product.name}</h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {hasDiscount && <Badge variant="destructive">-{product.discount}% OFF</Badge>}
                {product.isFeatured && <Badge>Featured</Badge>}
                {product.isTrending && <Badge variant="secondary">Trending</Badge>}
              </div>

              {/* Rating summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <AverageStarRating rating={averageRating} />
                  <span className="text-muted-foreground text-sm">
                    {averageRating.toFixed(1)} ({reviews.length} review
                    {reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold">${product.selling_price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-muted-foreground text-base line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <Separator />

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock */}
              <p
                className={`text-sm font-medium ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}
              >
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </p>

              {/* SKU */}
              <p className="text-muted-foreground text-xs">SKU: {product.sku}</p>

              {/* Quantity + Add to Cart */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={decrement}
                      disabled={quantity <= 1}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={increment}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={isOutOfStock}
                    onClick={() =>
                      dispatch(
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          image: product.media[0]?.path ?? '/images/placeholder.png',
                          price: product.price,
                          selling_price: product.selling_price,
                          discount: product.discount,
                          stock: product.stock,
                          quantity,
                        }),
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                </div>
              )}

              {isOutOfStock && (
                <Button variant="outline" disabled className="w-full">
                  Out of Stock
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-12" />

          {/* Reviews section */}
          <section>
            <h2 className="mb-6 text-2xl font-bold">
              Customer Reviews
              {reviews.length > 0 && (
                <span className="text-muted-foreground ml-2 text-base font-normal">
                  ({reviews.length})
                </span>
              )}
            </h2>

            {reviewsLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reviews yet for this product.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
