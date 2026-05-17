'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { setUser } from '@/features/auth/authSlice';
import { useOtpVerification } from '@/features/auth/hooks/use-otp-verification';
import { useResendOtp } from '@/features/auth/hooks/use-resend-otp';
import { OtpVerificationFormData, otpVerificationSchema } from '@/features/auth/validator';
import { useAppDispatch } from '@/store/hooks';

const RESEND_COOLDOWN = 60;

interface OtpVerificationFormProps {
  email: string;
}

export default function OtpVerificationForm({ email }: OtpVerificationFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: verifyOtp, isPending } = useOtpVerification();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const form = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email,
      otp: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startCountdown() {
    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const onSubmit = (data: OtpVerificationFormData) => {
    verifyOtp(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        if (res.data) {
          dispatch(setUser(res.data));
        }
        router.push('/');
      },
      onError: (err) => {
        toast.error(err.message);
        form.resetField('otp');
      },
    });
  };

  const handleResend = () => {
    resendOtp(email, {
      onSuccess: (res) => {
        toast.success(res.message);
        form.resetField('otp');
        startCountdown();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1***$2');

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">OTP Verification</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{' '}
          <span className="text-foreground font-medium">{maskedEmail}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="otp-verification-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="items-center gap-6">
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="items-center">
                  <FieldLabel htmlFor="otp" className="sr-only">
                    One-Time Password
                  </FieldLabel>
                  <div className="flex w-full flex-col items-center justify-center gap-2">
                    <InputOTP
                      {...field}
                      id="otp"
                      maxLength={6}
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Field orientation="responsive">
          <Button type="submit" form="otp-verification-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </Field>

        <p className="text-muted-foreground text-sm">
          {canResend ? (
            <>
              Didn&apos;t receive the code?{' '}
              <Button
                variant="link"
                className="text-primary h-auto p-0 text-sm"
                onClick={handleResend}
                disabled={isResending}
                type="button"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </Button>
            </>
          ) : (
            <>
              Resend OTP in{' '}
              <span className="text-foreground font-medium">
                {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                {String(countdown % 60).padStart(2, '0')}
              </span>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
