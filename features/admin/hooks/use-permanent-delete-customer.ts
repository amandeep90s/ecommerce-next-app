import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CUSTOMER_QUERY_KEY } from '@/features/admin/hooks/use-get-customers';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function permanentDeleteCustomer(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/customers/${id}/permanent`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to permanently delete customer');
  }
}

export function usePermanentDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEY });
    },
  });
}
