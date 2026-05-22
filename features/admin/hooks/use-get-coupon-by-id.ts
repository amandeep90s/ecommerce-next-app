import { useQuery } from '@tanstack/react-query';

import { COUPON_QUERY_KEY } from '@/features/admin/hooks/use-create-coupon';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCouponByIdResponse } from '@/types';

export const couponByIdQueryKey = (id: string) => [...COUPON_QUERY_KEY, id] as const;

async function getCouponById(id: string): Promise<IGetCouponByIdResponse> {
  const response = await fetchWithAuth(`/api/coupons/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch coupon');
  }

  return result;
}

export function useGetCouponById(id: string) {
  return useQuery({
    queryKey: couponByIdQueryKey(id),
    queryFn: () => getCouponById(id),
    enabled: !!id,
  });
}
