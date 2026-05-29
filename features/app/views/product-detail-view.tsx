'use client';

import { ChevronLeft, Minus, PackageSearch, Plus, Send, Star } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { addToCart } from '@/features/app/cartSlice';
import { ProductImageGallery } from '@/features/app/components/catalog/product-image-gallery';
import { ReviewCard } from '@/features/app/components/catalog/review-card';
import { useGetProductBySlug } from '@/features/app/hooks/use-get-product-by-slug';
import { useGetProductReviews } from '@/features/app/hooks/use-get-product-reviews';
import { useSubmitReview } from '@/features/app/hooks/use-submit-review';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

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
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const { mutate: submitReview, isPending: isSubmittingReview } = useSubmitReview();

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

  const reviewsPerPage = 2;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentPageReviews = reviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage,
  );

  function handleReviewSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!product || reviewRating === 0) return;
    submitReview(
      { productId: product.id, rating: reviewRating, title: reviewTitle, comment: reviewComment },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          setReviewRating(0);
          setReviewTitle('');
          setReviewComment('');
          setReviewPage(1);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

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
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Customer Reviews
                {reviews.length > 0 && (
                  <span className="text-muted-foreground ml-2 text-base font-normal">
                    ({reviews.length})
                  </span>
                )}
              </h2>
              {reviews.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <AverageStarRating rating={averageRating} />
                  <span className="text-muted-foreground text-sm">
                    {averageRating.toFixed(1)} average rating
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Reviews list */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {reviewsLoading ? (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <Card>
                    <CardContent className="flex h-32 items-center justify-center">
                      <p className="text-muted-foreground text-sm">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      {currentPageReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                    {totalReviewPages > 1 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                              className={
                                reviewPage === 1
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>
                          {Array.from({ length: totalReviewPages }).map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setReviewPage(i + 1)}
                                isActive={reviewPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setReviewPage((p) => Math.min(totalReviewPages, p + 1))
                              }
                              className={
                                reviewPage === totalReviewPages
                                  ? 'pointer-events-none opacity-50'
                                  : 'cursor-pointer'
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </div>

              {/* Submit review form */}
              <div className="lg:sticky lg:top-8 lg:h-fit">
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                    <CardDescription>Share your experience with this product</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isAuthenticated ? (
                      <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <p className="text-muted-foreground text-sm">
                          Please sign in to write a review.
                        </p>
                        <Button size="sm" asChild>
                          <Link href="/sign-in">Sign In</Link>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                        {/* User info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage src={user?.avatar?.url} alt={user?.name ?? 'User'} />
                            <AvatarFallback>
                              {user?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() ?? 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-muted-foreground text-xs">{user?.email}</p>
                          </div>
                        </div>

                        {/* Star rating */}
                        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                              className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110"
                            >
                              <Star
                                className={cn(
                                  'size-6 transition-colors',
                                  (hoveredStar || reviewRating) >= star
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-muted text-muted-foreground',
                                )}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Title */}
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="review-title">Title</Label>
                          <Input
                            id="review-title"
                            placeholder="Summary of your experience"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            required
                          />
                        </div>

                        {/* Comment */}
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="review-comment">Review</Label>
                          <Textarea
                            id="review-comment"
                            placeholder="Write your review here…"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            required
                            minLength={10}
                            className="min-h-[100px]"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmittingReview || reviewRating === 0}
                          className="w-full"
                        >
                          {isSubmittingReview ? (
                            'Submitting…'
                          ) : (
                            <>
                              Submit Review
                              <Send className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
