'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { type ChangePasswordFormData, changePasswordSchema } from '@/features/admin/validator';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData, form: UseFormReturn<ChangePasswordFormData>) => void;
  isPending: boolean;
}

export function ChangePasswordForm({ onSubmit, isPending }: ChangePasswordFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onSubmit',
  });

  function handleSubmit(data: ChangePasswordFormData) {
    onSubmit(data, form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Update Password</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <form
          id="change-password-form"
          className="max-w-xl"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FieldGroup>
            <div className="grid gap-4 lg:grid-cols-1">
              <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="currentPassword"
                        type={showCurrent ? 'text' : 'password'}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                        disabled={isPending}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowCurrent((prev) => !prev)}
                          aria-label={showCurrent ? 'Hide password' : 'Show password'}
                          className="text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent focus:outline-none"
                        >
                          {showCurrent ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="newPassword"
                        type={showNew ? 'text' : 'password'}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        disabled={isPending}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowNew((prev) => !prev)}
                          aria-label={showNew ? 'Hide password' : 'Show password'}
                          className="text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent focus:outline-none"
                        >
                          {showNew ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        disabled={isPending}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                          className="text-muted-foreground hover:text-foreground cursor-pointer hover:bg-transparent focus:outline-none"
                        >
                          {showConfirm ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-end pt-4">
        <Button type="submit" form="change-password-form" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          Change Password
        </Button>
      </CardFooter>
    </Card>
  );
}
