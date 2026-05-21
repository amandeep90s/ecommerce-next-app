'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';
import slugify from 'slugify';

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
import { useGetCategories } from '@/features/admin/hooks/use-get-categories';
import { type CreateProductFormData, createProductSchema } from '@/features/admin/validator';
import type { ICategoryItem } from '@/types';

interface ProductFormProps {
  defaultValues?: Partial<CreateProductFormData>;
  isLoading?: boolean;
  onSubmit: (data: CreateProductFormData, form: UseFormReturn<CreateProductFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: ProductFormProps) {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      selling_price: 0,
      discount: 0,
      description: '',
      media: [],
      sku: '',
      stock: 0,
      isActive: true,
      ...defaultValues,
    },
    mode: 'onSubmit',
  });

  // Reset form when defaultValues change (async data load for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: '',
        category: '',
        price: 0,
        selling_price: 0,
        discount: 0,
        description: '',
        media: [],
        sku: '',
        stock: 0,
        isActive: true,
        ...defaultValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const nameValue = useWatch({ control: form.control, name: 'name' });
  const slugPreview = slugify(nameValue || '', { replacement: '-', lower: true, strict: true });

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetCategories({ page: 1, limit: 100, filter: 'active' });
  const categories: ICategoryItem[] = categoriesData?.data?.items ?? [];

  function handleSubmit(data: CreateProductFormData) {
    onSubmit(data, form);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Product Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form id="product-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g. Wireless Headphones"
                    autoComplete="off"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Slug */}
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

            {/* SKU */}
            <Controller
              name="sku"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="sku">SKU</FieldLabel>
                  <Input
                    {...field}
                    id="sku"
                    placeholder="e.g. WH-1000XM5"
                    autoComplete="off"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending || isLoading}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Price & Selling Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="price">Price</FieldLabel>
                    <Input
                      {...field}
                      id="price"
                      type="number"
                      min={0}
                      step="0.01"
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="selling_price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="selling_price">Selling Price</FieldLabel>
                    <Input
                      {...field}
                      id="selling_price"
                      type="number"
                      min={0}
                      step="0.01"
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="discount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                    <Input
                      {...field}
                      id="discount"
                      type="number"
                      min={0}
                      max={100}
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Stock */}
            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="stock">Stock</FieldLabel>
                  <Input
                    {...field}
                    id="stock"
                    type="number"
                    min={0}
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <textarea
                    {...field}
                    id="description"
                    rows={4}
                    placeholder="Product description…"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* isActive */}
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={isPending || isLoading}
                      className="size-4 rounded border"
                    />
                    Active
                  </label>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <Button type="submit" form="product-form" disabled={isPending || isLoading}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
