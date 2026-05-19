import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { CATEGORY_QUERY_KEY } from '@/features/admin/hooks/use-create-category';
import { categoryByIdQueryKey } from '@/features/admin/hooks/use-get-category-by-id';
import type { UpdateCategoryFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateCategoryPayload, IUpdateCategoryResponse } from '@/types';

async function updateCategory(
  id: string,
  data: IUpdateCategoryPayload,
): Promise<IUpdateCategoryResponse> {
  const response = await fetchWithAuth(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateCategoryFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update category');
  }

  return result;
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateCategoryPayload) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: categoryByIdQueryKey(id) });
    },
  });
}
