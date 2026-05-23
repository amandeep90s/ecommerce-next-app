import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { ChangePasswordFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IChangePasswordPayload, IChangePasswordResponse } from '@/types';

async function changePassword(data: IChangePasswordPayload): Promise<IChangePasswordResponse> {
  const response = await fetchWithAuth('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<ChangePasswordFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to change password');
  }

  return result;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: IChangePasswordPayload) => changePassword(data),
  });
}
