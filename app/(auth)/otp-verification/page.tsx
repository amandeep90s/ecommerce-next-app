import { redirect } from 'next/navigation';

import OtpVerificationForm from '@/features/auth/components/otp-verification-form';

interface OtpVerificationPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function OtpVerificationPage({ searchParams }: OtpVerificationPageProps) {
  const { email } = await searchParams;

  if (!email) {
    redirect('/sign-in');
  }

  return <OtpVerificationForm email={email} />;
}
