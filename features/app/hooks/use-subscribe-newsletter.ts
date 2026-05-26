import { useMutation } from '@tanstack/react-query';

import type { ISubscribeNewsletterPayload, ISubscribeNewsletterResponse } from '@/types';

async function subscribeNewsletter(
  payload: ISubscribeNewsletterPayload,
): Promise<ISubscribeNewsletterResponse> {
  const response = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to subscribe');
  }

  return result;
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: subscribeNewsletter,
  });
}
