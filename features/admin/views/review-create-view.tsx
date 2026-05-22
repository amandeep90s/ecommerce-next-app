'use client';

import { useRouter } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { ReviewForm } from '@/features/admin/components/review/review-form';
import { useCreateReview } from '@/features/admin/hooks/use-create-review';
import { type CreateReviewFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function ReviewCreateView() {
  const router = useRouter();
  const { mutate: createReview, isPending } = useCreateReview();

  function onSubmit(data: CreateReviewFormData, form: UseFormReturn<CreateReviewFormData>) {
    createReview(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push('/admin/reviews');
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return <ReviewForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Review" />;
}
