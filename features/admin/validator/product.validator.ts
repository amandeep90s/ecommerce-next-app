import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(200, { message: 'Name must be less than 200 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  price: z.coerce.number().min(0, { message: 'Price must be at least 0' }),
  selling_price: z.coerce.number().min(0, { message: 'Selling price must be at least 0' }),
  discount: z.coerce.number().min(0).max(100).optional().default(0),
  description: z.string().max(5000).optional(),
  media: z.array(z.string()).optional().default([]),
  sku: z
    .string()
    .min(1, { message: 'SKU is required' })
    .max(100, { message: 'SKU must be less than 100 characters' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock must be at least 0' }),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
