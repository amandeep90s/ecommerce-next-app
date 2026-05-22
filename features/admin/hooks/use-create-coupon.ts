import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { CreateCouponFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { ICreateCouponPayload, ICreateCouponResponse } from '@/types';

export const COUPON_QUERY_KEY = ['coupons'] as const;

async function createCoupon(data: ICreateCouponPayload): Promise<ICreateCouponResponse> {
  const response = await fetchWithAuth('/api/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<CreateCouponFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to create coupon');
  }

  return result;
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
    },
  });
}
