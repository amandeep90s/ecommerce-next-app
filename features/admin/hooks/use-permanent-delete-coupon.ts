import { useMutation, useQueryClient } from '@tanstack/react-query';

import { COUPON_QUERY_KEY } from '@/features/admin/hooks/use-create-coupon';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function permanentDeleteCoupon(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/coupons/${id}/permanent`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to permanently delete coupon');
  }
}

export function usePermanentDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
    },
  });
}
