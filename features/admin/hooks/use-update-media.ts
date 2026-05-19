import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MEDIA_QUERY_KEY } from '@/features/admin/hooks/use-get-media';
import { mediaByIdQueryKey } from '@/features/admin/hooks/use-get-media-by-id';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IUpdateMediaPayload, IUpdateMediaResponse } from '@/types';

async function updateMedia(id: string, data: IUpdateMediaPayload): Promise<IUpdateMediaResponse> {
  const response = await fetchWithAuth(`/api/media/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update media');
  }

  return result;
}

export function useUpdateMedia(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateMediaPayload) => updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaByIdQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
    },
  });
}
