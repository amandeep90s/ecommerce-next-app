import { z } from 'zod';

export const uploadMediaSchema = z.object({
  asset_id: z.string(),
  public_id: z.string(),
  path: z.string(),
  thumbnail_url: z.string(),
  alt: z.string().optional(),
});

// Infer the TypeScript type from the Zod schema
export type UploadMediaFormData = z.infer<typeof uploadMediaSchema>;
