import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { PRODUCT_REVIEWS_QUERY_KEY } from '@/features/app/hooks/use-get-product-reviews';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { ICreateReviewResponse } from '@/types';

interface SubmitReviewPayload {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

async function submitReview(data: SubmitReviewPayload): Promise<ICreateReviewResponse> {
  const response = await fetchWithAuth('/api/reviews/public', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.CONFLICT) {
      throw new Error('You have already reviewed this product');
    }
    throw new Error(result.message || 'Failed to submit review');
  }

  return result;
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_REVIEWS_QUERY_KEY, variables.productId],
      });
    },
  });
}
