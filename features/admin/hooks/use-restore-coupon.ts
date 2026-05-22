import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COUPON_QUERY_KEY } from '@/features/admin/hooks/use-create-coupon';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function restoreCoupon(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/coupons/${id}/restore`, { method: 'PATCH' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to restore coupon');
  }
}

export function useRestoreCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
    },
  });
}
