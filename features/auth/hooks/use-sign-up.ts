import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { SignUpFormData } from '@/features/auth/validator';
import { ValidationError } from '@/lib/form-error';

interface SignUpResponse {
  message: string;
}

type SignUpPayload = Omit<SignUpFormData, 'confirmPassword'>;

async function signUp(data: SignUpPayload): Promise<SignUpResponse> {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<SignUpPayload>(result.message, result.errors);
    }
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
