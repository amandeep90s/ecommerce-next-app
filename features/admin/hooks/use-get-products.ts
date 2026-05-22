import { useQuery } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetProductsResponse } from '@/types';

interface GetProductsParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
}

async function getProducts(params: GetProductsParams): Promise<IGetProductsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/products?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch products');
  }

  return result;
}

export function useGetProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: [
      ...PRODUCT_QUERY_KEY,
      params.filter,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
    ],
    queryFn: () => getProducts(params),
  });
}
