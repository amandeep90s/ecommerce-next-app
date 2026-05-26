import { useQuery } from '@tanstack/react-query';

import type { IGetSettingsResponse } from '@/types';

export const PUBLIC_SETTINGS_QUERY_KEY = ['public-settings'] as const;

async function getPublicSettings(): Promise<IGetSettingsResponse> {
  const response = await fetch('/api/settings');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch settings');
  return result;
}

/**
 * Public hook to read app settings in client components.
 * Uses a 5-minute staleTime to avoid redundant API calls across page navigations.
 * For server components, use the cached `getSettings()` utility from `@/lib/get-settings`.
 */
export function useGetPublicSettings() {
  return useQuery({
    queryKey: PUBLIC_SETTINGS_QUERY_KEY,
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // keep in cache for 10 minutes
  });
}
