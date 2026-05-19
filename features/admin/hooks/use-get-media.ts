import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IGetMediaResponse } from '@/types';

export const MEDIA_QUERY_KEY = ['media'] as const;

async function getMedia(): Promise<IGetMediaResponse> {
  const response = await fetchWithAuth('/api/media');
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch media');
  }

  return result;
}

export function useGetMedia() {
  return useQuery({
    queryKey: MEDIA_QUERY_KEY,
    queryFn: getMedia,
  });
}
