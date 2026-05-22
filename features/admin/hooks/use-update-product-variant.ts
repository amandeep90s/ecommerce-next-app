import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { PRODUCT_VARIANT_QUERY_KEY } from '@/features/admin/hooks/use-create-product-variant';
import { productVariantByIdQueryKey } from '@/features/admin/hooks/use-get-product-variant-by-id';
import type { UpdateProductVariantFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateProductVariantPayload, IUpdateProductVariantResponse } from '@/types';

async function updateProductVariant(
  id: string,
  data: IUpdateProductVariantPayload,
): Promise<IUpdateProductVariantResponse> {
  const response = await fetchWithAuth(`/api/product-variants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateProductVariantFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update product variant');
  }

  return result;
}

export function useUpdateProductVariant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProductVariantPayload) => updateProductVariant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: productVariantByIdQueryKey(id) });
    },
  });
}
