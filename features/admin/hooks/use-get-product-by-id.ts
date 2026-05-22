import { useQuery } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetProductByIdResponse } from '@/types';

export const productByIdQueryKey = (id: string) => [...PRODUCT_QUERY_KEY, id] as const;

async function getProductById(id: string): Promise<IGetProductByIdResponse> {
  const response = await fetchWithAuth(`/api/products/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch product');
  }

  return result;
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: productByIdQueryKey(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
