import { useQuery } from '@tanstack/react-query';

import { PRODUCT_VARIANT_QUERY_KEY } from '@/features/admin/hooks/use-create-product-variant';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetProductVariantByIdResponse } from '@/types';

export const productVariantByIdQueryKey = (id: string) =>
  [...PRODUCT_VARIANT_QUERY_KEY, id] as const;

async function getProductVariantById(id: string): Promise<IGetProductVariantByIdResponse> {
  const response = await fetchWithAuth(`/api/product-variants/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch product variant');
  }

  return result;
}

export function useGetProductVariantById(id: string) {
  return useQuery({
    queryKey: productVariantByIdQueryKey(id),
    queryFn: () => getProductVariantById(id),
    enabled: !!id,
  });
}
