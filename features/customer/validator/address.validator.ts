import { z } from 'zod';

import { EAddressType } from '@/enums';

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Full name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  phone: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .max(20, { message: 'Phone must be less than 20 characters' }),
  address_line1: z
    .string()
    .min(1, { message: 'Address line 1 is required' })
    .max(200, { message: 'Address line 1 must be less than 200 characters' }),
  address_line2: z
    .string()
    .max(200, { message: 'Address line 2 must be less than 200 characters' })
    .optional()
    .or(z.literal('')),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  postal_code: z
    .string()
    .min(1, { message: 'Postal code is required' })
    .max(20, { message: 'Postal code must be less than 20 characters' }),
  type: z.nativeEnum(EAddressType, { message: 'Address type is required' }),
  is_default: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
