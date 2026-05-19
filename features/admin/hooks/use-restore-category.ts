import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CATEGORY_QUERY_KEY } from '@/features/admin/hooks/use-create-category';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreCategory(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/categories/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore category');
  }
}

export function useRestoreCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
}
