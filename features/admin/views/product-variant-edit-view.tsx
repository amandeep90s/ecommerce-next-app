'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductVariantForm } from '@/features/admin/components/product-variant/product-variant-form';
import { useGetProductVariantById } from '@/features/admin/hooks/use-get-product-variant-by-id';
import { useUpdateProductVariant } from '@/features/admin/hooks/use-update-product-variant';
import { type CreateProductVariantFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

interface ProductVariantEditViewProps {
  id: string;
}

export function ProductVariantEditView({ id }: ProductVariantEditViewProps) {
  const { data, isLoading } = useGetProductVariantById(id);
  const { mutate: updateVariant, isPending } = useUpdateProductVariant(id);

  const variant = data?.data;

  function onSubmit(
    formData: CreateProductVariantFormData,
    form: UseFormReturn<CreateProductVariantFormData>,
  ) {
    updateVariant(formData, {
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

  if (!variant) {
    return <p className="text-muted-foreground text-sm">Product variant not found.</p>;
  }

  return (
    <ProductVariantForm
      defaultValues={{
        product: typeof variant.product === 'string' ? variant.product : variant.product?.id,
        color: variant.color,
        size: variant.size as CreateProductVariantFormData['size'],
        price: variant.price,
        selling_price: variant.selling_price,
        discount: variant.discount,
        media: variant.media?.map((m) => (typeof m === 'string' ? m : m.id)) ?? [],
        sku: variant.sku,
        stock: variant.stock,
        isActive: variant.isActive,
      }}
      defaultMediaItems={variant.media ?? []}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Save Changes"
    />
  );
}
