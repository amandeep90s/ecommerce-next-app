'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { CouponForm } from '@/features/admin/components/coupon/coupon-form';
import { useGetCouponById } from '@/features/admin/hooks/use-get-coupon-by-id';
import { useUpdateCoupon } from '@/features/admin/hooks/use-update-coupon';
import { type CreateCouponFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

interface CouponEditViewProps {
  id: string;
}

export function CouponEditView({ id }: CouponEditViewProps) {
  const { data, isLoading } = useGetCouponById(id);
  const { mutate: updateCoupon, isPending } = useUpdateCoupon(id);

  const coupon = data?.data;

  function onSubmit(formData: CreateCouponFormData, form: UseFormReturn<CreateCouponFormData>) {
    updateCoupon(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  if (isLoading) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    );
  }

  if (!coupon) {
    return <p className="text-muted-foreground text-sm">Coupon not found.</p>;
  }

  // Format date string for the DatePicker (YYYY-MM-DD)
  function formatDate(dateStr: string) {
    return new Date(dateStr).toISOString().split('T')[0];
  }

  return (
    <CouponForm
      defaultValues={{
        code: coupon.code,
        discount: coupon.discount,
        minimumPurchase: coupon.minimumPurchase,
        validFrom: formatDate(coupon.validFrom),
        validTo: formatDate(coupon.validTo),
        isActive: coupon.isActive,
      }}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Save Changes"
    />
  );
}
