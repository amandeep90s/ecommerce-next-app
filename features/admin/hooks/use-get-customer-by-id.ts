import { useQuery } from '@tanstack/react-query';

import { CUSTOMER_QUERY_KEY } from '@/features/admin/hooks/use-get-customers';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCustomerByIdResponse } from '@/types';

async function getCustomerById(id: string): Promise<IGetCustomerByIdResponse> {
  const response = await fetchWithAuth(`/api/customers/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch customer');
  }

  return result;
}

export function useGetCustomerById(id: string) {
  return useQuery({
    queryKey: [...CUSTOMER_QUERY_KEY, id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
}
