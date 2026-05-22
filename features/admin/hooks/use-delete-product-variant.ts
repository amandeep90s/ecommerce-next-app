import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PRODUCT_VARIANT_QUERY_KEY } from '@/features/admin/hooks/use-create-product-variant';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteProductVariant(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/product-variants/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete product variant');
  }
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANT_QUERY_KEY });
    },
  });
}
