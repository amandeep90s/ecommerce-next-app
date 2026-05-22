import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { COUPON_QUERY_KEY } from '@/features/admin/hooks/use-create-coupon';
import { couponByIdQueryKey } from '@/features/admin/hooks/use-get-coupon-by-id';
import type { UpdateCouponFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateCouponPayload, IUpdateCouponResponse } from '@/types';

async function updateCoupon(
  id: string,
  data: IUpdateCouponPayload,
): Promise<IUpdateCouponResponse> {
  const response = await fetchWithAuth(`/api/coupons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateCouponFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update coupon');
  }

  return result;
}

export function useUpdateCoupon(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateCouponPayload) => updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: couponByIdQueryKey(id) });
    },
  });
}
