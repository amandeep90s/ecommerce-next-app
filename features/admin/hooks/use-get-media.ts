import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { IGetMediaResponse, MediaFilter } from '@/types';

export const MEDIA_QUERY_KEY = ['media'] as const;

interface GetMediaParams {
  filter: MediaFilter;
  page: number;
  limit?: number;
}

async function getMedia(params: GetMediaParams): Promise<IGetMediaResponse> {
  const searchParams = new URLSearchParams({
    filter: params.filter,
    page: params.page.toString(),
    limit: (params.limit ?? 20).toString(),
  });

  const response = await fetchWithAuth(`/api/media?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch media');
  }

  return result;
}

export function useGetMedia(params: GetMediaParams) {
  return useQuery({
    queryKey: [...MEDIA_QUERY_KEY, params.filter, params.page, params.limit ?? 20],
    queryFn: () => getMedia(params),
  });
}
