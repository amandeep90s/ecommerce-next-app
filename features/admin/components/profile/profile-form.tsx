'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { type UpdateProfileFormData, updateProfileSchema } from '@/features/admin/validator';

interface ProfileFormProps {
  defaultValues?: Partial<UpdateProfileFormData>;
  email?: string;
  onSubmit: (data: UpdateProfileFormData, form: UseFormReturn<UpdateProfileFormData>) => void;
  isPending: boolean;
}

export function ProfileForm({ defaultValues, email, onSubmit, isPending }: ProfileFormProps) {
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '', phone: '', ...defaultValues },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (defaultValues?.name !== undefined) {
      form.reset({ name: defaultValues.name, phone: defaultValues.phone ?? '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name]);

  function handleSubmit(data: UpdateProfileFormData) {
    onSubmit(data, form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Profile Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form id="profile-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="e.g. John Doe"
                      autoComplete="name"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email ?? ''}
                  readOnly
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                />
              </Field>

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="phone">
                      Phone{' '}
                      <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="e.g. +91 98765 43210"
                      autoComplete="tel"
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="justify-end pt-4">
        <Button type="submit" form="profile-form" disabled={isPending}>
          {isPending && <Spinner className="mr-2 size-4" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
