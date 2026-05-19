import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MEDIA_QUERY_KEY } from '@/features/admin/hooks/use-get-media';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IRestoreMediaPayload, IRestoreMediaResponse } from '@/types';

async function restoreMedia(data: IRestoreMediaPayload): Promise<IRestoreMediaResponse> {
  const response = await fetchWithAuth('/api/media/restore', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore media');
  }

  return result;
}

export function useRestoreMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });
}
