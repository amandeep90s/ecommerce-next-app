import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetSettingsResponse } from '@/types';

export const SETTINGS_QUERY_KEY = ['settings'] as const;

async function getSettings(): Promise<IGetSettingsResponse> {
  const response = await fetchWithAuth('/api/settings');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch settings');
  return result;
}

export function useGetSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
  });
}
