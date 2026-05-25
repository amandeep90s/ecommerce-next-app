import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  description: z
    .string()
    .trim()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional()
    .nullable(),
  image: z.string().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
