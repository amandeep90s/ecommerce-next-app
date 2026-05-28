import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IUpdateAvatarPayload, IUpdateAvatarResponse } from '@/types';

async function updateAvatar(data: IUpdateAvatarPayload): Promise<IUpdateAvatarResponse> {
  const response = await fetchWithAuth('/api/auth/avatar', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new Error(result.message || 'Validation failed');
    }
    throw new Error(result.message || 'Failed to update avatar');
  }

  return result;
}

async function removeAvatar(): Promise<IUpdateAvatarResponse> {
  const response = await fetchWithAuth('/api/auth/avatar', {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to remove avatar');
  }

  return result;
}

export function useUpdateAvatar() {
  return useMutation({
    mutationFn: updateAvatar,
  });
}

export function useRemoveAvatar() {
  return useMutation({
    mutationFn: removeAvatar,
  });
}
