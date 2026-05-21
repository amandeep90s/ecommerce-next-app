import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { PRODUCT_QUERY_KEY } from '@/features/admin/hooks/use-create-product';
import { productByIdQueryKey } from '@/features/admin/hooks/use-get-product-by-id';
import type { UpdateProductFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateProductPayload, IUpdateProductResponse } from '@/types';

async function updateProduct(
  id: string,
  data: IUpdateProductPayload,
): Promise<IUpdateProductResponse> {
  const response = await fetchWithAuth(`/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateProductFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update product');
  }

  return result;
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProductPayload) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: productByIdQueryKey(id) });
    },
  });
}
