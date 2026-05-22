'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { ProductForm } from '@/features/admin/components/product/product-form';
import { useGetProductById } from '@/features/admin/hooks/use-get-product-by-id';
import { useUpdateProduct } from '@/features/admin/hooks/use-update-product';
import { type CreateProductFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

interface ProductEditViewProps {
  id: string;
}

export function ProductEditView({ id }: ProductEditViewProps) {
  const { data, isLoading } = useGetProductById(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct(id);

  const product = data?.data;

  function onSubmit(formData: CreateProductFormData, form: UseFormReturn<CreateProductFormData>) {
    updateProduct(formData, {
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

  if (!product) {
    return <p className="text-muted-foreground text-sm">Product not found.</p>;
  }

  return (
    <ProductForm
      defaultValues={{
        name: product.name,
        category: typeof product.category === 'string' ? product.category : product.category?.id,
        price: product.price,
        selling_price: product.selling_price,
        discount: product.discount,
        description: product.description ?? '',
        media: product.media?.map((m) => (typeof m === 'string' ? m : m.id)) ?? [],
        sku: product.sku,
        stock: product.stock,
        isActive: product.isActive,
      }}
      defaultMediaItems={product.media ?? []}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Save Changes"
    />
  );
}
