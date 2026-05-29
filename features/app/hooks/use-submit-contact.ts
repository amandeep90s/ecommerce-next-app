import { useMutation } from '@tanstack/react-query';

import type { ISubmitContactPayload, ISubmitContactResponse } from '@/types';

async function submitContact(payload: ISubmitContactPayload): Promise<ISubmitContactResponse> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to send message');
  }

  return result;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: submitContact,
  });
}
