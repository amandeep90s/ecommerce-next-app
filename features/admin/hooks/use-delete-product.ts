import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteProduct(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/products/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete product');
  }
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    },
  });
}
