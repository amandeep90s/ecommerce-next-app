import { StatusCodes } from 'http-status-codes';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Setting from '@/models/setting.model';

const SETTINGS_ID = 'app-settings';

const updateSettingsSchema = z.object({
  storeName: z.string().max(200).optional(),
  storeEmail: z.email('Invalid email address').or(z.literal('')).optional(),
  storePhone: z.string().max(30).optional(),
  storeAddress: z.string().max(500).optional(),
  logoUrl: z.url('Invalid URL').or(z.literal('')).optional(),
  currency: z.string().max(10).optional(),
  currencySymbol: z.string().max(5).optional(),
  socialLinks: z
    .object({
      facebook: z.url('Invalid URL').or(z.literal('')).optional(),
      twitter: z.url('Invalid URL').or(z.literal('')).optional(),
      instagram: z.url('Invalid URL').or(z.literal('')).optional(),
      youtube: z.url('Invalid URL').or(z.literal('')).optional(),
    })
    .optional(),
  seoMetaTitle: z.string().max(160).optional(),
  seoMetaDescription: z.string().max(320).optional(),
  maintenanceMode: z.boolean().optional(),
});

// ─── GET /api/settings — Public: return current settings ───────────────────

export async function GET() {
  try {
    await connectToDatabase();

    const settings = await Setting.findById(SETTINGS_ID);

    return successResponse({
      message: 'Settings fetched successfully',
      data: settings ?? null,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch settings',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── PATCH /api/settings — Admin: upsert settings ──────────────────────────

export async function PATCH(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: z.flattenError(parsed.error).fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const updated = await Setting.findByIdAndUpdate(
      SETTINGS_ID,
      { $set: { _id: SETTINGS_ID, ...parsed.data } },
      { upsert: true, new: true, runValidators: true },
    );

    // Bust the Next.js cache so public pages get fresh data
    revalidateTag('settings', 'max');

    return successResponse({
      message: 'Settings updated successfully',
      data: updated,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update settings',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
