'use client';

import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useEmailVerification } from '@/features/auth/hooks/use-email-verification';
import { useResendVerification } from '@/features/auth/hooks/use-resend-verification';

interface EmailVerificationProps {
  token: string;
}

export default function EmailVerification({ token }: EmailVerificationProps) {
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useEmailVerification();
  const {
    mutate: resendVerification,
    isPending: isResending,
    isSuccess: isResent,
  } = useResendVerification();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    verifyEmail(token);
  }, [token, verifyEmail]);

  const handleResend = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    setEmailError('');
    resendVerification(email, {
      onSuccess: (data) => toast.success(data.message),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Card className="w-full max-w-sm text-center">
      <CardHeader>
        {isPending && (
          <>
            <CardTitle className="text-xl">Verifying Email</CardTitle>
            <CardDescription>Please wait while we verify your email address.</CardDescription>
          </>
        )}
        {isSuccess && (
          <>
            <div className="mb-2 flex justify-center">
              <CheckCircle2Icon className="size-12 text-green-500" />
            </div>
            <CardTitle className="text-xl">Email Verified</CardTitle>
            <CardDescription>Your email has been verified successfully.</CardDescription>
          </>
        )}
        {isError && (
          <>
            <div className="mb-2 flex justify-center">
              <XCircleIcon className="text-destructive size-12" />
            </div>
            <CardTitle className="text-xl">Verification Failed</CardTitle>
            <CardDescription>{error?.message}</CardDescription>
          </>
        )}
      </CardHeader>

      {isPending && (
        <CardContent className="flex justify-center">
          <Spinner className="size-8" />
        </CardContent>
      )}

      {isError && !isResent && (
        <CardContent>
          <form id="resend-form" onSubmit={handleResend}>
            <Field data-invalid={!!emailError} className="text-left">
              <FieldLabel htmlFor="email">Resend verification email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isResending}
                aria-invalid={!!emailError}
                autoComplete="off"
              />
              {emailError && <FieldError errors={[{ message: emailError }]} />}
            </Field>
          </form>
        </CardContent>
      )}

      <CardFooter className="flex-col gap-3">
        {isSuccess && (
          <Button asChild className="w-full">
            <Link href="/sign-in">Continue to Sign In</Link>
          </Button>
        )}
        {isError && !isResent && (
          <Button type="submit" form="resend-form" className="w-full" disabled={isResending}>
            {isResending && <Spinner data-icon="inline-start" />}
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        )}
        {isError && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-up">Back to Sign Up</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
