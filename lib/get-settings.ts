import { unstable_cache } from 'next/cache';

import { connectToDatabase } from '@/config/database';
import Setting from '@/models/setting.model';
import type { ISettingsItem } from '@/types';

/**
 * Server-side cached function that fetches app settings.
 * Cached with the 'settings' tag — bust by calling revalidateTag('settings')
 * from the PATCH /api/settings route after an admin update.
 */
export const getSettings = unstable_cache(
  async (): Promise<ISettingsItem | null> => {
    await connectToDatabase();
    const doc = await Setting.findById('app-settings');
    if (!doc) return null;
    return doc.toJSON() as ISettingsItem;
  },
  ['settings'],
  { tags: ['settings'] },
);
