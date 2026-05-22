import { useMutation, useQueryClient } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-create-review';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function permanentDeleteReview(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/reviews/${id}/permanent`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to permanently delete review');
  }
}

export function usePermanentDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}
