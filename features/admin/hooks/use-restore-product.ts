import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreProduct(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/products/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore product');
  }
}

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
}
