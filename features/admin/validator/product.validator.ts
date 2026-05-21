import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(200, { message: 'Name must be less than 200 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  price: z.number().min(0, { message: 'Price must be at least 0' }),
  selling_price: z.number().min(0, { message: 'Selling price must be at least 0' }),
  discount: z.number().min(0).max(100),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(5000, { message: 'Description must be less than 5000 characters' }),
  media: z.array(z.string()).min(1, { message: 'At least one media is required' }),
  sku: z
    .string()
    .trim()
    .min(1, { message: 'SKU is required' })
    .max(100, { message: 'SKU must be less than 100 characters' }),
  stock: z.number().int().min(0, { message: 'Stock must be at least 0' }),
  isActive: z.boolean(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
