import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { CreateReviewFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { ICreateReviewPayload, ICreateReviewResponse } from '@/types';

export const REVIEW_QUERY_KEY = ['reviews'] as const;

async function createReview(data: ICreateReviewPayload): Promise<ICreateReviewResponse> {
  const response = await fetchWithAuth('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<CreateReviewFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to create review');
  }

  return result;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}
