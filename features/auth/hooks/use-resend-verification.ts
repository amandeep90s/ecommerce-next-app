import { useMutation } from '@tanstack/react-query';

interface ResendVerificationResponse {
  message: string;
}

async function resendVerification(email: string): Promise<ResendVerificationResponse> {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong');
  }

  return result;
}

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
  });
}
