import { useMutation, useQueryClient } from '@tanstack/react-query';

import { REVIEW_QUERY_KEY } from '@/features/admin/hooks/use-get-reviews';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteReview(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/reviews/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete review');
  }
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY });
    },
  });
}
