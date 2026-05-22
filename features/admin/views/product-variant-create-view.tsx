'use client';

import { useRouter } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { ProductVariantForm } from '@/features/admin/components/product-variant/product-variant-form';
import { useCreateProductVariant } from '@/features/admin/hooks/use-create-product-variant';
import { type CreateProductVariantFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function ProductVariantCreateView() {
  const router = useRouter();
  const { mutate: createVariant, isPending } = useCreateProductVariant();

  function onSubmit(
    data: CreateProductVariantFormData,
    form: UseFormReturn<CreateProductVariantFormData>,
  ) {
    createVariant(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push('/admin/products/variants');
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return (
    <ProductVariantForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Variant" />
  );
}
