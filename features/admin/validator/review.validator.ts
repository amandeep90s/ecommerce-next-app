import { z } from 'zod';

export const createReviewSchema = z.object({
  product: z.string().min(1, { message: 'Product is required' }),
  user: z.string().min(1, { message: 'User is required' }),
  rating: z
    .number()
    .int()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' }),
  title: z
    .string()
    .trim()
    .min(2, { message: 'Title must be at least 2 characters' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  comment: z
    .string()
    .trim()
    .min(10, { message: 'Comment must be at least 10 characters' })
    .max(2000, { message: 'Comment must be less than 2000 characters' }),
});

export const updateReviewSchema = createReviewSchema.partial();

export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>;
