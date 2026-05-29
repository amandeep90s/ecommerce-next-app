import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SUPPORT_TICKETS_QUERY_KEY } from '@/features/admin/hooks/use-get-support-tickets';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IUpdateSupportTicketPayload, IUpdateSupportTicketResponse } from '@/types';

interface UpdateSupportTicketArgs {
  id: string;
  payload: IUpdateSupportTicketPayload;
}

async function updateSupportTicket({
  id,
  payload,
}: UpdateSupportTicketArgs): Promise<IUpdateSupportTicketResponse> {
  const response = await fetchWithAuth(`/api/support-tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update support ticket');
  }

  return result;
}

export function useUpdateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY });
    },
  });
}
