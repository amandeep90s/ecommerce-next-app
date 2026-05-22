'use client';

import { useRouter } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { CouponForm } from '@/features/admin/components/coupon/coupon-form';
import { useCreateCoupon } from '@/features/admin/hooks/use-create-coupon';
import { type CreateCouponFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function CouponCreateView() {
  const router = useRouter();
  const { mutate: createCoupon, isPending } = useCreateCoupon();

  function onSubmit(data: CreateCouponFormData, form: UseFormReturn<CreateCouponFormData>) {
    createCoupon(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push('/admin/coupons');
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return <CouponForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Coupon" />;
}
