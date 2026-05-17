'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { OtpVerificationForm } from '@/features/auth/components/otp-verification-form';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';
import { SignInFormData, signInSchema } from '@/features/auth/validator';
import { handleFormError } from '@/lib/form-error';

export function SignInForm() {
  const { mutate: signIn, isPending } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: SignInFormData) => {
    signIn(data, {
      onSuccess: (res) => {
        toast.success(res.message);
        setOtpSentEmail(data.email);
      },
      onError: (err) => handleFormError(err, form),
    });
  };

  if (otpSentEmail) {
    return <OtpVerificationForm email={otpSentEmail} />;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      disabled={isPending}
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent focus:outline-none"
                      >
                        {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="text-right">
              <p className="text-muted-foreground text-sm">
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </p>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Field orientation="responsive">
          <Button type="submit" form="sign-in-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </Field>

        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
