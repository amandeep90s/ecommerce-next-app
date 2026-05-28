import { useQuery } from '@tanstack/react-query';

import type { IGetProductByIdResponse } from '@/types';

export const PRODUCT_BY_SLUG_QUERY_KEY = 'product-by-slug';

async function getProductBySlug(slug: string): Promise<IGetProductByIdResponse> {
  const response = await fetch(`/api/products/public/${slug}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch product');
  }

  return result;
}

export function useGetProductBySlug(slug: string) {
  return useQuery({
    queryKey: [PRODUCT_BY_SLUG_QUERY_KEY, slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}
