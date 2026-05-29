import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetSupportTicketsResponse } from '@/types';

export const SUPPORT_TICKETS_QUERY_KEY = ['support-tickets'] as const;

interface GetSupportTicketsParams {
  page: number;
  limit?: number;
  q?: string;
  status?: string;
  priority?: string;
  category?: string;
}

async function getSupportTickets(
  params: GetSupportTicketsParams,
): Promise<IGetSupportTicketsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
  });

  if (params.q) searchParams.set('q', params.q);
  if (params.status) searchParams.set('status', params.status);
  if (params.priority) searchParams.set('priority', params.priority);
  if (params.category) searchParams.set('category', params.category);

  const response = await fetchWithAuth(`/api/support-tickets?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch support tickets');
  }

  return result;
}

export function useGetSupportTickets(params: GetSupportTicketsParams) {
  return useQuery({
    queryKey: [
      ...SUPPORT_TICKETS_QUERY_KEY,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
      params.status ?? '',
      params.priority ?? '',
      params.category ?? '',
    ],
    queryFn: () => getSupportTickets(params),
  });
}
