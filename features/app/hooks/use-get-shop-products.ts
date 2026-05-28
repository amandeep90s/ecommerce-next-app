import { useQuery } from '@tanstack/react-query';

import type { CatalogState } from '@/features/app/catalogSlice';
import type { IGetPublicProductsPaginatedResponse } from '@/types';

export const SHOP_PRODUCTS_QUERY_KEY = 'shop-products';

async function getShopProducts(params: CatalogState): Promise<IGetPublicProductsPaginatedResponse> {
  const searchParams = new URLSearchParams({ page: String(params.page) });
  if (params.search) searchParams.set('q', params.search);
  if (params.category) searchParams.set('category', params.category);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.priceMin) searchParams.set('priceMin', params.priceMin);
  if (params.priceMax) searchParams.set('priceMax', params.priceMax);

  const response = await fetch(`/api/products/public?${searchParams.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch products');
  }

  return result;
}

export function useGetShopProducts(params: CatalogState) {
  return useQuery({
    queryKey: [SHOP_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getShopProducts(params),
    // Keep previous data visible while fetching next page / new filter
    placeholderData: (prev) => prev,
  });
}
