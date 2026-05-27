import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  phone: z
    .string()
    .max(20, { message: 'Phone must be less than 20 characters' })
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
