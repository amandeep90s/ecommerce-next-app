import { useQuery } from '@tanstack/react-query';

import type { IProductVariantItem } from '@/types';

export const PRODUCT_VARIANTS_QUERY_KEY = 'product-variants-public';

interface GetProductVariantsResponse {
  message: string;
  data: IProductVariantItem[];
}

async function getProductVariants(productId: string): Promise<GetProductVariantsResponse> {
  const response = await fetch(`/api/product-variants/public?product=${productId}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch product variants');
  }

  return result;
}

export function useGetProductVariants(productId: string) {
  return useQuery({
    queryKey: [PRODUCT_VARIANTS_QUERY_KEY, productId],
    queryFn: () => getProductVariants(productId),
    enabled: !!productId,
  });
}
