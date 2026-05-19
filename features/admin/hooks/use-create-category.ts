import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { CreateCategoryFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { ICreateCategoryPayload, ICreateCategoryResponse } from '@/types';

export const CATEGORY_QUERY_KEY = ['categories'] as const;

async function createCategory(data: ICreateCategoryPayload): Promise<ICreateCategoryResponse> {
  const response = await fetchWithAuth('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<CreateCategoryFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to create category');
  }

  return result;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
    },
  });
}
