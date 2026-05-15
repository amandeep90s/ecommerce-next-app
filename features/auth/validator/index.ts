import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .email()
    .min(1, { message: 'Email is required' })
    .max(100, { message: 'Email must be less than 100 characters' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(100, { message: 'Name must be less than 100 characters' }),
    email: z
      .email()
      .min(1, { message: 'Email is required' })
      .max(100, { message: 'Email must be less than 100 characters' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must be less than 100 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Infer the TypeScript type from the Zod schema
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
