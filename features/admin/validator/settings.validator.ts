import { z } from 'zod';

const urlOrEmpty = z.string().url('Must be a valid URL').or(z.literal('')).optional();

export const updateSettingsSchema = z.object({
  storeName: z.string().max(200, 'Max 200 characters').optional(),
  storeEmail: z.string().email('Invalid email address').or(z.literal('')).optional(),
  storePhone: z.string().max(30, 'Max 30 characters').optional(),
  storeAddress: z.string().max(500, 'Max 500 characters').optional(),
  logoUrl: urlOrEmpty,
  currency: z.string().max(10, 'Max 10 characters').optional(),
  currencySymbol: z.string().max(5, 'Max 5 characters').optional(),
  socialLinks: z
    .object({
      facebook: urlOrEmpty,
      twitter: urlOrEmpty,
      instagram: urlOrEmpty,
      youtube: urlOrEmpty,
    })
    .optional(),
  seoMetaTitle: z.string().max(160, 'Max 160 characters').optional(),
  seoMetaDescription: z.string().max(320, 'Max 320 characters').optional(),
  maintenanceMode: z.boolean().optional(),
});

export type UpdateSettingsFormData = z.infer<typeof updateSettingsSchema>;
