import { useMutation, useQueryClient } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-get-reviews';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreReview(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/reviews/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore review');
  }
}

export function useRestoreReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}
