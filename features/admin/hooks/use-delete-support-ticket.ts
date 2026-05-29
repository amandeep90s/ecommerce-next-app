import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SUPPORT_TICKETS_QUERY_KEY } from '@/features/admin/hooks/use-get-support-tickets';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteSupportTicket(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/support-tickets/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete support ticket');
  }
}

export function useDeleteSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY });
    },
  });
}
