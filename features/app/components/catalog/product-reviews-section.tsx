'use client';

import { Send, Star } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { AverageStarRating } from '@/features/app/components/catalog/product-info';
import { ReviewCard } from '@/features/app/components/catalog/review-card';
import { useSubmitReview } from '@/features/app/hooks/use-submit-review';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import type { IReviewItem } from '@/types';

const REVIEWS_PER_PAGE = 2;

interface ProductReviewsSectionProps {
  productId: string;
  reviews: IReviewItem[];
  reviewsLoading: boolean;
  averageRating: number;
}

export function ProductReviewsSection({
  productId,
  reviews,
  reviewsLoading,
  averageRating,
}: ProductReviewsSectionProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const { mutate: submitReview, isPending: isSubmittingReview } = useSubmitReview();

  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const currentPageReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (reviewRating === 0) return;
    submitReview(
      { productId, rating: reviewRating, title: reviewTitle, comment: reviewComment },
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

  return (
    <section>
      {/* Section header */}
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
                          reviewPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
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
                        onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
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
                  <p className="text-muted-foreground text-sm">Please sign in to write a review.</p>
                  <Button size="sm" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
  );
}
