import { useQuery } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-create-review';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetReviewsResponse } from '@/types';

interface GetReviewsParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
}

async function getReviews(params: GetReviewsParams): Promise<IGetReviewsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/reviews?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch reviews');
  }

  return result;
}

export function useGetReviews(params: GetReviewsParams) {
  return useQuery({
    queryKey: [...REVIEW_QUERY_KEY, params.filter, params.page, params.limit ?? 10, params.q ?? ''],
    queryFn: () => getReviews(params),
  });
}
