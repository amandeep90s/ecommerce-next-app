import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IGetMediaByIdResponse } from '@/types';

export const mediaByIdQueryKey = (id: string) => ['media', id] as const;

async function getMediaById(id: string): Promise<IGetMediaByIdResponse> {
  const response = await fetchWithAuth(`/api/media/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch media');
  }

  return result;
}

export function useGetMediaById(id: string) {
  return useQuery({
    queryKey: mediaByIdQueryKey(id),
    queryFn: () => getMediaById(id),
    enabled: !!id,
  });
}
