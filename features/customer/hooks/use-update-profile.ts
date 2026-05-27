import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { UpdateProfileFormData } from '@/features/customer/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateProfileResponse } from '@/types';

async function updateProfile(data: UpdateProfileFormData): Promise<IUpdateProfileResponse> {
  const response = await fetchWithAuth('/api/auth/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateProfileFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update profile');
  }

  return result;
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}
