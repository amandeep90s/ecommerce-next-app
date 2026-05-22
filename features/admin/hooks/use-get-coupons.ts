import { useQuery } from '@tanstack/react-query';

import { COUPON_QUERY_KEY } from '@/features/admin/hooks/use-create-coupon';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCouponsResponse } from '@/types';

interface GetCouponsParams {
  page: number;
  limit?: number;
  q?: string;
  filter: 'active' | 'trashed';
}

async function getCoupons(params: GetCouponsParams): Promise<IGetCouponsResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
    filter: params.filter,
  });

  if (params.q) searchParams.set('q', params.q);

  const response = await fetchWithAuth(`/api/coupons?${searchParams}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch coupons');
  }

  return result;
}

export function useGetCoupons(params: GetCouponsParams) {
  return useQuery({
    queryKey: [...COUPON_QUERY_KEY, params.filter, params.page, params.limit ?? 10, params.q ?? ''],
    queryFn: () => getCoupons(params),
  });
}
