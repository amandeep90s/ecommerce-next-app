import { useMutation } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

interface EmailVerificationResponse {
  message: string;
}

async function verifyEmail(token: string): Promise<EmailVerificationResponse> {
  const response = await fetch('/api/auth/email-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const result = await response.json();

  if (!response.ok) {
    if (response.status === StatusCodes.UNAUTHORIZED) {
      throw new Error(result.message);
    }
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function useEmailVerification() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}
