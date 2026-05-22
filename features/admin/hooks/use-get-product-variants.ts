import { useQuery } from '@tanstack/react-query';

import { PRODUCT_VARIANT_QUERY_KEY } from '@/features/admin/hooks/use-create-product-variant';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetProductVariantsResponse } from '@/types';

interface GetProductVariantsParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
  product?: string;
}

async function getProductVariants(
  params: GetProductVariantsParams,
): Promise<IGetProductVariantsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);
  if (params.product) searchParams.set('product', params.product);

  const response = await fetchWithAuth(`/api/product-variants?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch product variants');
  }

  return result;
}

export function useGetProductVariants(params: GetProductVariantsParams) {
  return useQuery({
    queryKey: [
      ...PRODUCT_VARIANT_QUERY_KEY,
      params.filter,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
      params.product ?? '',
    ],
    queryFn: () => getProductVariants(params),
  });
}
