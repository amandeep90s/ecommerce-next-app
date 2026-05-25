import { useQuery } from '@tanstack/react-query';

import type { ICategoryItem } from '@/types';

interface IGetPublicCategoriesResponse {
  message: string;
  data: ICategoryItem[];
}

async function getPublicCategories(): Promise<IGetPublicCategoriesResponse> {
  const response = await fetch('/api/categories/public');
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch categories');
  }

  return result;
}

export function useGetPublicCategories() {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: getPublicCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes — categories don't change often
  });
}
