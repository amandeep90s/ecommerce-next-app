'use client';

import { useRouter } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { ProductForm } from '@/features/admin/components/product/product-form';
import { useCreateProduct } from '@/features/admin/hooks/use-create-product';
import { type CreateProductFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function ProductCreateView() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  function onSubmit(data: CreateProductFormData, form: UseFormReturn<CreateProductFormData>) {
    createProduct(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push('/admin/products');
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return <ProductForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Product" />;
}
