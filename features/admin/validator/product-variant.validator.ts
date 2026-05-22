import { z } from 'zod';

import { EProductVariantSize } from '@/enums';

export const createProductVariantSchema = z.object({
  product: z.string().min(1, { message: 'Product is required' }),
  color: z
    .string()
    .trim()
    .min(1, { message: 'Color is required' })
    .max(50, { message: 'Color must be less than 50 characters' }),
  size: z.nativeEnum(EProductVariantSize, { message: 'Invalid size' }),
  price: z.number().min(0, { message: 'Price must be at least 0' }),
  selling_price: z.number().min(0, { message: 'Selling price must be at least 0' }),
  discount: z.number().min(0).max(100),
  media: z.array(z.string()).min(1, { message: 'At least one media is required' }),
  sku: z
    .string()
    .trim()
    .min(1, { message: 'SKU is required' })
    .max(100, { message: 'SKU must be less than 100 characters' }),
  stock: z.number().int().min(0, { message: 'Stock must be at least 0' }),
  isActive: z.boolean(),
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

export type CreateProductVariantFormData = z.infer<typeof createProductVariantSchema>;
export type UpdateProductVariantFormData = z.infer<typeof updateProductVariantSchema>;
