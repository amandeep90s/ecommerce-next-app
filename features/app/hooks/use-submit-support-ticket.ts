import { useMutation } from '@tanstack/react-query';

import type { ISubmitSupportTicketPayload, ISubmitSupportTicketResponse } from '@/types';

async function submitSupportTicket(
  payload: ISubmitSupportTicketPayload,
): Promise<ISubmitSupportTicketResponse> {
  const response = await fetch('/api/support-tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to submit support ticket');
  }

  return result;
}

export function useSubmitSupportTicket() {
  return useMutation({
    mutationFn: submitSupportTicket,
  });
}
