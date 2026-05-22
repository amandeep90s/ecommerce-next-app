import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { CreateProductVariantFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { ICreateProductVariantPayload, ICreateProductVariantResponse } from '@/types';

export const PRODUCT_VARIANT_QUERY_KEY = ['product-variants'] as const;

async function createProductVariant(
  data: ICreateProductVariantPayload,
): Promise<ICreateProductVariantResponse> {
  const response = await fetchWithAuth('/api/product-variants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<CreateProductVariantFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to create product variant');
  }

  return result;
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANT_QUERY_KEY });
    },
  });
}
