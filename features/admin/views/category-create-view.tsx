'use client';

import { useRouter } from 'next/navigation';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { CategoryForm } from '@/features/admin/components/category/category-form';
import { useCreateCategory } from '@/features/admin/hooks/use-create-category';
import { type CreateCategoryFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function CategoryCreateView() {
  const router = useRouter();
  const { mutate: createCategory, isPending } = useCreateCategory();

  function onSubmit(data: CreateCategoryFormData, form: UseFormReturn<CreateCategoryFormData>) {
    createCategory(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        router.push('/admin/categories');
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return <CategoryForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Category" />;
}
