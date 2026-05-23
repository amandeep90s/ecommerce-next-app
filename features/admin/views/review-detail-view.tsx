'use client';

import { ArrowLeftIcon, MailIcon, StarIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Separator } from '@/components/ui/separator';
import { useDeleteReview } from '@/features/admin/hooks/use-delete-review';
import { useGetReviewById } from '@/features/admin/hooks/use-get-review-by-id';
import { usePermanentDeleteReview } from '@/features/admin/hooks/use-permanent-delete-review';
import { useRestoreReview } from '@/features/admin/hooks/use-restore-review';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`size-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating}/5</span>
    </div>
  );
}

interface ReviewDetailViewProps {
  id: string;
}

export function ReviewDetailView({ id }: ReviewDetailViewProps) {
  const router = useRouter();
  const { data, isLoading } = useGetReviewById(id);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutate: restoreReview, isPending: isRestoring } = useRestoreReview();
  const { mutate: permanentDelete, isPending: isPermanentDeleting } = usePermanentDeleteReview();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);

  const review = data?.data;

  function handleDelete() {
    if (!review) return;
    deleteReview(review.id, {
      onSuccess: () => {
        toast.success('Review moved to trash.');
        router.push('/admin/reviews');
      },
      onError: (e) => toast.error(e.message),
    });
  }

  function handleRestore() {
    if (!review) return;
    restoreReview(review.id, {
      onSuccess: () => toast.success('Review restored.'),
      onError: (e) => toast.error(e.message),
    });
  }

  function handlePermanentDelete() {
    if (!review) return;
    permanentDelete(review.id, {
      onSuccess: () => {
        toast.success('Review permanently deleted.');
        router.push('/admin/reviews');
      },
      onError: (e) => toast.error(e.message),
    });
  }

  const isPending = isDeleting || isRestoring || isPermanentDeleting;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="bg-muted h-6 w-64 animate-pulse rounded" />
              <div className="bg-muted h-4 w-48 animate-pulse rounded" />
              <div className="bg-muted h-20 w-full animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!review) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Review not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link href="/admin/reviews">
          <ArrowLeftIcon className="size-4" />
          Back to Reviews
        </Link>
      </Button>

      {/* Review Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">Review Details</CardTitle>
          <div className="flex gap-2">
            {review.deletedAt ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setIsRestoreOpen(true)}
                >
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => setIsPermanentOpen(true)}
                >
                  <Trash2Icon className="size-4" />
                  Delete Permanently
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2Icon className="size-4" />
                Move to Trash
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-6 pt-6">
          {/* Rating & Status */}
          <div className="flex items-center gap-4">
            <StarRating rating={review.rating} />
            {review.deletedAt ? (
              <Badge variant="destructive">Trashed</Badge>
            ) : (
              <Badge variant="secondary">Active</Badge>
            )}
          </div>

          {/* Title & Comment */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{review.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
          </div>

          <Separator />

          {/* Customer info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium">Customer</h4>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={review.user?.avatar?.url} alt={review.user?.name} />
                <AvatarFallback>{getInitials(review.user?.name || 'U')}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{review.user?.name || '—'}</span>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <MailIcon className="size-3" />
                  {review.user?.email || '—'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Product</h4>
            <p className="text-sm">{review.product?.name || '—'}</p>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span>
              Created:{' '}
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>
              Updated:{' '}
              {new Date(review.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Move to Trash"
        description="Move this review to trash? You can restore it later."
        confirmLabel="Move to Trash"
        variant="destructive"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        title="Restore Review"
        description="Restore this review? It will become visible again."
        confirmLabel="Restore"
        onConfirm={handleRestore}
      />
      <ConfirmDialog
        open={isPermanentOpen}
        onOpenChange={setIsPermanentOpen}
        title="Delete Permanently"
        description="Permanently delete this review? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handlePermanentDelete}
      />
    </div>
  );
}
