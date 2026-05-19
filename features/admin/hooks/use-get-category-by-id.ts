import { useQuery } from '@tanstack/react-query';

import { CATEGORY_QUERY_KEY } from '@/features/admin/hooks/use-create-category';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCategoryByIdResponse } from '@/types';

export const categoryByIdQueryKey = (id: string) => [...CATEGORY_QUERY_KEY, id] as const;

async function getCategoryById(id: string): Promise<IGetCategoryByIdResponse> {
  const response = await fetchWithAuth(`/api/categories/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch category');
  }

  return result;
}

export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: categoryByIdQueryKey(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}
