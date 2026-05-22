import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-create-review';
import { reviewByIdQueryKey } from '@/features/admin/hooks/use-get-review-by-id';
import type { UpdateReviewFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateReviewPayload, IUpdateReviewResponse } from '@/types';

async function updateReview(
  id: string,
  data: IUpdateReviewPayload,
): Promise<IUpdateReviewResponse> {
  const response = await fetchWithAuth(`/api/reviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateReviewFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update review');
  }

  return result;
}

export function useUpdateReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateReviewPayload) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: reviewByIdQueryKey(id) });
    },
  });
}
