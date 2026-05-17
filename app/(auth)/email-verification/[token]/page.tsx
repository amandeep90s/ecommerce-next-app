import { EmailVerification } from '@/features/auth/components/email-verification';

interface EmailVerificationPageProps {
  params: Promise<{ token: string }>;
}

export default async function EmailVerificationPage({ params }: EmailVerificationPageProps) {
  const { token } = await params;

  return <EmailVerification token={token} />;
}
