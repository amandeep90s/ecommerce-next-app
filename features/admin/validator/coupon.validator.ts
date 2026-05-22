import { z } from 'zod';

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const baseCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, { message: 'Code must be at least 2 characters' })
    .max(50, { message: 'Code must be less than 50 characters' }),
  discount: z.number().min(0, { message: 'Discount must be at least 0' }).max(100),
  minimumPurchase: z.number().min(0, { message: 'Minimum purchase must be at least 0' }),
  validFrom: z.string().min(1, { message: 'Valid from date is required' }),
  validTo: z.string().min(1, { message: 'Valid to date is required' }),
  isActive: z.boolean(),
});

export const createCouponSchema = baseCouponSchema.superRefine((data, ctx) => {
  const from = data.validFrom ? new Date(data.validFrom) : null;
  const to = data.validTo ? new Date(data.validTo) : null;

  if (from && from < today()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validFrom'],
      message: 'Valid from date cannot be in the past',
    });
  }

  if (to && to < today()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'Valid to date cannot be in the past',
    });
  }

  if (from && to && to <= from) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'Valid to date must be after valid from date',
    });
  }
});

export const updateCouponSchema = baseCouponSchema.partial().superRefine((data, ctx) => {
  const from = data.validFrom ? new Date(data.validFrom) : null;
  const to = data.validTo ? new Date(data.validTo) : null;

  if (from && from < today()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validFrom'],
      message: 'Valid from date cannot be in the past',
    });
  }

  if (to && to < today()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'Valid to date cannot be in the past',
    });
  }

  if (from && to && to <= from) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['validTo'],
      message: 'Valid to date must be after valid from date',
    });
  }
});

export type CreateCouponFormData = z.infer<typeof createCouponSchema>;
export type UpdateCouponFormData = z.infer<typeof updateCouponSchema>;
