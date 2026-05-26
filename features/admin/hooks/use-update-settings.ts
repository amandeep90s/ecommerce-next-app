import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import { SETTINGS_QUERY_KEY } from '@/features/admin/hooks/use-get-settings';
import type { UpdateSettingsFormData } from '@/features/admin/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IUpdateSettingsResponse } from '@/types';

async function updateSettings(data: UpdateSettingsFormData): Promise<IUpdateSettingsResponse> {
  const response = await fetchWithAuth('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<UpdateSettingsFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update settings');
  }

  return result;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}
