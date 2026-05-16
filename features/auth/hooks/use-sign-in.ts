import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { SignInFormData } from '@/features/auth/validator';
import { ValidationError } from '@/lib/form-error';

interface SignInResponse {
  message: string;
}

async function signIn(data: SignInFormData): Promise<SignInResponse> {
  const response = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<SignInFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
  });
}
