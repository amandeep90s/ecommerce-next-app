import { useQuery } from '@tanstack/react-query';

import type { IGetPublicReviewsResponse } from '@/types';

export const PRODUCT_REVIEWS_QUERY_KEY = 'product-reviews';

async function getProductReviews(
  productId: string,
  limit = 20,
): Promise<IGetPublicReviewsResponse> {
  const response = await fetch(`/api/reviews/public?product=${productId}&limit=${limit}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch reviews');
  }

  return result;
}

export function useGetProductReviews(productId: string, limit = 20) {
  return useQuery({
    queryKey: [PRODUCT_REVIEWS_QUERY_KEY, productId, limit],
    queryFn: () => getProductReviews(productId, limit),
    enabled: !!productId,
  });
}
