import { useQuery } from '@tanstack/react-query';

import type { IReviewItem } from '@/types';

interface IGetPublicReviewsResponse {
  message: string;
  data: IReviewItem[];
}

async function getPublicReviews(limit = 6): Promise<IGetPublicReviewsResponse> {
  const response = await fetch(`/api/reviews/public?limit=${limit}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch reviews');
  }

  return result;
}

export function useGetPublicReviews(limit = 6) {
  return useQuery({
    queryKey: ['public-reviews', limit],
    queryFn: () => getPublicReviews(limit),
  });
}
