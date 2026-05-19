import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CATEGORY_QUERY_KEY } from '@/features/admin/hooks/use-create-category';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteCategory(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/categories/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete category');
  }
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
}
