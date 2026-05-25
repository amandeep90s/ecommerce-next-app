import { useQuery } from '@tanstack/react-query';

import type { IGetPublicProductsResponse } from '@/types';

export const TRENDING_PRODUCTS_QUERY_KEY = 'trending-products';

async function getTrendingProducts(limit = 8): Promise<IGetPublicProductsResponse> {
  const response = await fetch(`/api/products/trending?limit=${limit}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch trending products');
  }

  return result;
}

export function useGetTrendingProducts(limit = 8) {
  return useQuery({
    queryKey: [TRENDING_PRODUCTS_QUERY_KEY, limit],
    queryFn: () => getTrendingProducts(limit),
  });
}
