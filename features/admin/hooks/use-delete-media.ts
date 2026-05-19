import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MEDIA_QUERY_KEY } from '@/features/admin/hooks/use-get-media';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IBulkDeleteMediaPayload, IBulkDeleteMediaResponse } from '@/types';

async function bulkDeleteMedia(data: IBulkDeleteMediaPayload): Promise<IBulkDeleteMediaResponse> {
  const response = await fetchWithAuth('/api/media/bulk', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete media');
  }

  return result;
}

export function useBulkDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });
}
