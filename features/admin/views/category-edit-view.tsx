'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { CategoryForm } from '@/features/admin/components/category/category-form';
import { useGetCategoryById } from '@/features/admin/hooks/use-get-category-by-id';
import { useUpdateCategory } from '@/features/admin/hooks/use-update-category';
import { type UpdateCategoryFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

interface CategoryEditViewProps {
  id: string;
}

export function CategoryEditView({ id }: CategoryEditViewProps) {
  const { data, isLoading } = useGetCategoryById(id);
  const { mutate: updateCategory, isPending } = useUpdateCategory(id);

  const category = data?.data;

  function onSubmit(formData: UpdateCategoryFormData, form: UseFormReturn<UpdateCategoryFormData>) {
    updateCategory(formData, {
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
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    );
  }

  if (!category) {
    return <p className="text-muted-foreground text-sm">Category not found.</p>;
  }

  return (
    <CategoryForm
      defaultValues={{
        name: category.name,
        description: category.description ?? '',
        image: category.image?.id ?? null,
      }}
      defaultImageItem={category.image ?? null}
      onSubmit={onSubmit}
      isPending={isPending}
      submitLabel="Save Changes"
    />
  );
}
