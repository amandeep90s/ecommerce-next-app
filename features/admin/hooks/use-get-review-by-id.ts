import { useQuery } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-create-review';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetReviewByIdResponse } from '@/types';

export const reviewByIdQueryKey = (id: string) => [...REVIEW_QUERY_KEY, id] as const;

async function getReviewById(id: string): Promise<IGetReviewByIdResponse> {
  const response = await fetchWithAuth(`/api/reviews/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch review');
  }

  return result;
}

export function useGetReviewById(id: string) {
  return useQuery({
    queryKey: reviewByIdQueryKey(id),
    queryFn: () => getReviewById(id),
    enabled: !!id,
  });
}
