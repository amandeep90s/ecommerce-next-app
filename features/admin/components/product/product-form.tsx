'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';
import slugify from 'slugify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { MediaPickerDialog } from '@/features/admin/components/product/media-picker-dialog';
import { useGetCategories } from '@/features/admin/hooks/use-get-categories';
import { type CreateProductFormData, createProductSchema } from '@/features/admin/validator';
import type { ICategoryItem, IMediaItem } from '@/types';

interface ProductFormProps {
  defaultValues?: Partial<CreateProductFormData>;
  defaultMediaItems?: IMediaItem[];
  isLoading?: boolean;
  onSubmit: (data: CreateProductFormData, form: UseFormReturn<CreateProductFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  defaultMediaItems,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: ProductFormProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<IMediaItem[]>(defaultMediaItems ?? []);

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
      isFeatured: false,
      isTrending: false,
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
        isFeatured: false,
        isTrending: false,
        ...defaultValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  function handleMediaConfirm(items: IMediaItem[]) {
    setSelectedMedia(items);
    form.setValue(
      'media',
      items.map((m) => m.id),
      { shouldValidate: true },
    );
  }

  function handleRemoveMedia(id: string) {
    const updated = selectedMedia.filter((m) => m.id !== id);
    setSelectedMedia(updated);
    form.setValue(
      'media',
      updated.map((m) => m.id),
      { shouldValidate: true },
    );
  }

  const nameValue = useWatch({ control: form.control, name: 'name' });
  const slugPreview = slugify(nameValue || '', { replacement: '-', lower: true, strict: true });

  // Auto-calculate discount from price and selling_price
  const priceValue = useWatch({ control: form.control, name: 'price' });
  const sellingPriceValue = useWatch({ control: form.control, name: 'selling_price' });
  const computedDiscount =
    priceValue > 0 && sellingPriceValue >= 0 && sellingPriceValue <= priceValue
      ? Math.round(((priceValue - sellingPriceValue) / priceValue) * 100)
      : 0;
  form.setValue('discount', computedDiscount);

  // Fetch categories for dropdown
  const { data: categoriesData } = useGetCategories({ page: 1, limit: 100, filter: 'active' });
  const categories: ICategoryItem[] = (categoriesData?.data?.items ?? []).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

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

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Product description…"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Media */}
            <Controller
              name="media"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel>Media</FieldLabel>
                  <div className="flex flex-col gap-3">
                    {selectedMedia.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                        {selectedMedia.map((media) => (
                          <div
                            key={media.id}
                            className="group relative overflow-hidden rounded-lg border"
                          >
                            <div className="relative aspect-square">
                              <Image
                                src={media.path}
                                alt={media.alt || media.public_id}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 33vw, 16vw"
                              />
                            </div>
                            <button
                              type="button"
                              className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex size-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => handleRemoveMedia(media.id)}
                              disabled={isPending || isLoading}
                              aria-label="Remove media"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => {
                        setPickerKey((k) => k + 1);
                        setMediaPickerOpen(true);
                      }}
                      disabled={isPending || isLoading}
                    >
                      <ImagePlusIcon className="size-4" />
                      {selectedMedia.length > 0 ? 'Change Media' : 'Select Media'}
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <MediaPickerDialog
              key={pickerKey}
              open={mediaPickerOpen}
              onOpenChange={setMediaPickerOpen}
              selected={selectedMedia}
              onConfirm={handleMediaConfirm}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="price">Price</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(num) ? '' : num);
                      }}
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Selling Price */}
              <Controller
                name="selling_price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="selling_price">Selling Price</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(num) ? '' : num);
                      }}
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

              {/* Discount — auto-calculated */}
              <Field>
                <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                <Input
                  id="discount"
                  type="number"
                  value={computedDiscount}
                  readOnly
                  disabled
                  className="text-muted-foreground"
                />
              </Field>

              {/* Stock */}
              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="stock">Stock</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(num) ? '' : num);
                      }}
                      id="stock"
                      type="number"
                      min={0}
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* isActive */}
            <Controller
              name="isActive"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState?.invalid || undefined}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    id="isActive"
                    aria-invalid={fieldState.invalid || undefined}
                    disabled={isPending || isLoading}
                  />
                  <FieldLabel htmlFor="isActive">Active</FieldLabel>
                </Field>
              )}
            />

            {/* isFeatured */}
            <Controller
              name="isFeatured"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState?.invalid || undefined}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    id="isFeatured"
                    aria-invalid={fieldState.invalid || undefined}
                    disabled={isPending || isLoading}
                  />
                  <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
                </Field>
              )}
            />

            {/* isTrending */}
            <Controller
              name="isTrending"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState?.invalid || undefined}>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    id="isTrending"
                    aria-invalid={fieldState.invalid || undefined}
                    disabled={isPending || isLoading}
                  />
                  <FieldLabel htmlFor="isTrending">Trending</FieldLabel>
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
