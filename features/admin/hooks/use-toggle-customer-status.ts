import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CUSTOMER_QUERY_KEY } from '@/features/admin/hooks/use-get-customers';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function toggleCustomerStatus(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/customers/${id}/toggle-status`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to toggle customer status');
  }
}

export function useToggleCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCustomerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEY });
    },
  });
}
