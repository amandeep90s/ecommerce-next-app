import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetContactSubmissionsResponse } from '@/types';

export const CONTACT_QUERY_KEY = ['contact-submissions'] as const;

interface GetContactSubmissionsParams {
  page: number;
  limit?: number;
  q?: string;
  status?: string;
}

async function getContactSubmissions(
  params: GetContactSubmissionsParams,
): Promise<IGetContactSubmissionsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
  });

  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);

  const response = await fetchWithAuth(`/api/contact?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch contact submissions');
  }

  return result;
}

export function useGetContactSubmissions(params: GetContactSubmissionsParams) {
  return useQuery({
    queryKey: [
      ...CONTACT_QUERY_KEY,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
      params.status ?? '',
    ],
    queryFn: () => getContactSubmissions(params),
  });
}
