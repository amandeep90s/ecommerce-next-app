'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { ReviewForm } from '@/features/admin/components/review/review-form';
import { useGetReviewById } from '@/features/admin/hooks/use-get-review-by-id';
import { useUpdateReview } from '@/features/admin/hooks/use-update-review';
import { type CreateReviewFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

interface ReviewEditViewProps {
  id: string;
}

export function ReviewEditView({ id }: ReviewEditViewProps) {
  const { data, isLoading } = useGetReviewById(id);
  const { mutate: updateReview, isPending } = useUpdateReview(id);

  const review = data?.data;

  function onSubmit(formData: CreateReviewFormData, form: UseFormReturn<CreateReviewFormData>) {
    // Only editable fields can be updated
    const { rating, title, comment } = formData;
    updateReview(
      { rating, title, comment },
      {
        onSuccess: (res) => {
          toast.success(res.message);
        },
        onError: (error) => handleFormError(error, form),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-28 w-full rounded" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    );
  }

  if (!review) {
    return <p className="text-muted-foreground text-sm">Review not found.</p>;
  }

  return (
    <ReviewForm
      defaultValues={{
        product: typeof review.product === 'string' ? review.product : review.product?.id,
        user: typeof review.user === 'string' ? review.user : review.user?.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      }}
      onSubmit={onSubmit}
      isPending={isPending}
      isEditMode
      submitLabel="Save Changes"
    />
  );
}
