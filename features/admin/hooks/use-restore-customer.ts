import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CUSTOMER_QUERY_KEY } from '@/features/admin/hooks/use-get-customers';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreCustomer(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/customers/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore customer');
  }
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEY });
    },
  });
}
