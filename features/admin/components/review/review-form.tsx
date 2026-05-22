'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useGetProducts } from '@/features/admin/hooks/use-get-products';
import { type CreateReviewFormData, createReviewSchema } from '@/features/admin/validator';

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

interface ReviewFormProps {
  defaultValues?: Partial<CreateReviewFormData>;
  isLoading?: boolean;
  onSubmit: (data: CreateReviewFormData, form: UseFormReturn<CreateReviewFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
  /** When true, product and user fields are read-only (edit mode) */
  isEditMode?: boolean;
}

export function ReviewForm({
  defaultValues,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
  isEditMode = false,
}: ReviewFormProps) {
  const form = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      product: '',
      user: '',
      rating: 5,
      title: '',
      comment: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
  });

  // Reset form when defaultValues change (async data load for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        product: '',
        user: '',
        rating: 5,
        title: '',
        comment: '',
        ...defaultValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // Fetch products for dropdown
  const { data: productsData } = useGetProducts({ page: 1, limit: 100, filter: 'active' });
  const products = (productsData?.data?.items ?? []).sort((a, b) => a.name.localeCompare(b.name));

  function handleSubmit(data: CreateReviewFormData) {
    onSubmit(data, form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Review Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form id="review-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Product */}
              <Controller
                name="product"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="product">Product</FieldLabel>
                    {isEditMode ? (
                      <Input
                        id="product"
                        value={
                          products.find((p) => p.id === field.value)?.name ?? field.value ?? ''
                        }
                        readOnly
                        disabled
                        className="text-muted-foreground"
                      />
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending || isLoading}
                      >
                        <SelectTrigger id="product">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* User (ObjectId / email) */}
              <Controller
                name="user"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="user">User ID</FieldLabel>
                    <Input
                      {...field}
                      id="user"
                      placeholder="Enter user ObjectId"
                      autoComplete="off"
                      disabled={isPending || isLoading || isEditMode}
                      readOnly={isEditMode}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Rating */}
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel>Rating</FieldLabel>
                  <div className="flex items-center gap-1">
                    {RATING_OPTIONS.map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={isPending || isLoading}
                        onClick={() => field.onChange(star)}
                        aria-label={`Rate ${star} out of 5`}
                        className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <StarIcon
                          className={`size-7 transition-colors ${
                            star <= field.value
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-muted-foreground ml-2 text-sm">{field.value} / 5</span>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="e.g. Great product!"
                    autoComplete="off"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Comment */}
            <Controller
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="comment">Comment</FieldLabel>
                  <Textarea
                    {...field}
                    id="comment"
                    placeholder="Write a detailed review…"
                    rows={4}
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button type="submit" form="review-form" disabled={isPending || isLoading}>
          {isPending && <Spinner className="mr-2 size-4" />}
          {submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
