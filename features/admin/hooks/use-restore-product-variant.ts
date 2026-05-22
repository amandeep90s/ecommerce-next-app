import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PRODUCT_VARIANT_QUERY_KEY } from '@/features/admin/hooks/use-create-product-variant';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreProductVariant(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/product-variants/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore product variant');
  }
}

export function useRestoreProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANT_QUERY_KEY });
    },
  });
}
