import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetNewsletterSubscribersResponse } from '@/types';

export const NEWSLETTER_QUERY_KEY = ['newsletter-subscribers'] as const;

interface GetNewsletterSubscribersParams {
  page: number;
  limit?: number;
  q?: string;
}

async function getNewsletterSubscribers(
  params: GetNewsletterSubscribersParams,
): Promise<IGetNewsletterSubscribersResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/newsletter?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch newsletter subscribers');
  }

  return result;
}

export function useGetNewsletterSubscribers(params: GetNewsletterSubscribersParams) {
  return useQuery({
    queryKey: [...NEWSLETTER_QUERY_KEY, params.page, params.limit ?? 10, params.q ?? ''],
    queryFn: () => getNewsletterSubscribers(params),
  });
}
