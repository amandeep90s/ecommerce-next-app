import { useMutation } from '@tanstack/react-query';

interface ResendOtpResponse {
  message: string;
}

async function resendOtp(email: string): Promise<ResendOtpResponse> {
  const response = await fetch('/api/auth/resend-otp', {
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

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
  });
}
