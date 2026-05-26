import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NEWSLETTER_QUERY_KEY } from '@/features/admin/hooks/use-get-newsletter-subscribers';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteNewsletterSubscriber(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/newsletter/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to remove subscriber');
  }
}

export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNewsletterSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWSLETTER_QUERY_KEY });
    },
  });
}
