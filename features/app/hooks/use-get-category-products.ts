import { useQuery } from '@tanstack/react-query';

import type { CatalogSortOption } from '@/features/app/catalogSlice';
import type { IGetPublicProductsPaginatedResponse } from '@/types';

export interface CategoryProductsParams {
  categoryId: string;
  search: string;
  sort: CatalogSortOption;
  page: number;
  priceMin: string;
  priceMax: string;
}

async function getCategoryProducts(
  params: CategoryProductsParams,
): Promise<IGetPublicProductsPaginatedResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    category: params.categoryId,
  });
  if (params.search) searchParams.set('q', params.search);
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

export function useGetCategoryProducts(params: CategoryProductsParams, enabled = true) {
  return useQuery({
    queryKey: ['category-products', params],
    queryFn: () => getCategoryProducts(params),
    enabled: enabled && Boolean(params.categoryId),
    placeholderData: (prev) => prev,
  });
}
