import { useQuery } from '@tanstack/react-query';

import { CATEGORY_QUERY_KEY } from '@/features/admin/hooks/use-create-category';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCategoriesResponse } from '@/types';

interface GetCategoriesParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
}

async function getCategories(params: GetCategoriesParams): Promise<IGetCategoriesResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/categories?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch categories');
  }

  return result;
}

export function useGetCategories(params: GetCategoriesParams) {
  return useQuery({
    queryKey: [
      ...CATEGORY_QUERY_KEY,
      params.filter,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
    ],
    queryFn: () => getCategories(params),
  });
}
