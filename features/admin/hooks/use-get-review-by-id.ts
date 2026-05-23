import { useQuery } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-get-reviews';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetReviewByIdResponse } from '@/types';

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
    queryKey: [...REVIEW_QUERY_KEY, id],
    queryFn: () => getReviewById(id),
    enabled: !!id,
  });
}
