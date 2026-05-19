'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';
import slugify from 'slugify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { type CreateCategoryFormData, createCategorySchema } from '@/features/admin/validator';

interface CategoryFormProps {
  defaultValues?: Partial<CreateCategoryFormData>;
  isLoading?: boolean;
  onSubmit: (data: CreateCategoryFormData, form: UseFormReturn<CreateCategoryFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function CategoryForm({
  defaultValues,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: CategoryFormProps) {
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: '', ...defaultValues },
    mode: 'onSubmit',
  });

  // Reset form when defaultValues change (async data load for edit mode)
  useEffect(() => {
    if (defaultValues?.name !== undefined) {
      form.reset({ name: defaultValues.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name]);

  const nameValue = useWatch({ control: form.control, name: 'name' });
  const slugPreview = slugify(nameValue || '', { replacement: '-', lower: true, strict: true });

  function handleSubmit(data: CreateCategoryFormData) {
    onSubmit(data, form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Category Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form id="category-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g. Electronics"
                    autoComplete="off"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Slug (auto-generated)</FieldLabel>
              <Input
                value={slugPreview}
                readOnly
                disabled
                className="text-muted-foreground"
                placeholder="slug-will-appear-here"
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <Button type="submit" form="category-form" disabled={isPending || isLoading}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
