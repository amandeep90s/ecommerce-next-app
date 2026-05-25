import { useQuery } from '@tanstack/react-query';

import type { IGetPublicProductsResponse } from '@/types';

export const FEATURED_PRODUCTS_QUERY_KEY = 'featured-products';

async function getFeaturedProducts(limit = 8): Promise<IGetPublicProductsResponse> {
  const response = await fetch(`/api/products/featured?limit=${limit}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch featured products');
  }

  return result;
}

export function useGetFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [FEATURED_PRODUCTS_QUERY_KEY, limit],
    queryFn: () => getFeaturedProducts(limit),
  });
}
