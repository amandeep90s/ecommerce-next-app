import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCustomersResponse } from '@/types';

export const CUSTOMER_QUERY_KEY = ['customers'] as const;

interface GetCustomersParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
}

async function getCustomers(params: GetCustomersParams): Promise<IGetCustomersResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/customers?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch customers');
  }

  return result;
}

export function useGetCustomers(params: GetCustomersParams) {
  return useQuery({
    queryKey: [
      ...CUSTOMER_QUERY_KEY,
      params.filter,
      params.page,
      params.limit ?? 10,
      params.q ?? '',
    ],
    queryFn: () => getCustomers(params),
  });
}
