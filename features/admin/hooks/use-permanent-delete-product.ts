import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function permanentDeleteProduct(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/products/${id}/permanent`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to permanently delete product');
  }
}

export function usePermanentDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
}
