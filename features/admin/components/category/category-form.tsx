'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';
import slugify from 'slugify';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { MediaPickerDialog } from '@/features/admin/components/product/media-picker-dialog';
import { type CreateCategoryFormData, createCategorySchema } from '@/features/admin/validator';
import type { IMediaItem } from '@/types';

interface CategoryFormProps {
  defaultValues?: Partial<CreateCategoryFormData>;
  defaultImageItem?: IMediaItem | null;
  isLoading?: boolean;
  onSubmit: (data: CreateCategoryFormData, form: UseFormReturn<CreateCategoryFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function CategoryForm({
  defaultValues,
  defaultImageItem,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: CategoryFormProps) {
  const [selectedImage, setSelectedImage] = useState<IMediaItem | null>(defaultImageItem ?? null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: '', description: '', image: null, ...defaultValues },
    mode: 'onSubmit',
  });

  // Reset form when defaultValues change (async data load for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? '',
        description: defaultValues.description ?? '',
        image: defaultValues.image ?? null,
      });
      setSelectedImage(defaultImageItem ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.name, defaultValues?.description, defaultValues?.image]);

  const nameValue = useWatch({ control: form.control, name: 'name' });
  const slugPreview = slugify(nameValue || '', { replacement: '-', lower: true, strict: true });

  function handleImageConfirm(items: IMediaItem[]) {
    const item = items[0] ?? null;
    setSelectedImage(item);
    form.setValue('image', item?.id ?? null, { shouldValidate: true });
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    form.setValue('image', null, { shouldValidate: true });
  }

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
            </div>

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    id="description"
                    placeholder="Short description of the category…"
                    rows={3}
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Image */}
            <Controller
              name="image"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel>Image</FieldLabel>
                  <div className="flex flex-col gap-3">
                    {selectedImage && (
                      <div className="group relative w-fit overflow-hidden rounded-lg border">
                        <div className="relative size-28">
                          <Image
                            src={selectedImage.path}
                            alt={selectedImage.alt || selectedImage.public_id}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <button
                          type="button"
                          className="bg-destructive text-destructive-foreground absolute top-1 right-1 flex size-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={handleRemoveImage}
                          disabled={isPending || isLoading}
                          aria-label="Remove image"
                        >
                          <XIcon className="size-3" />
                        </button>
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
                      {selectedImage ? 'Change Image' : 'Select Image'}
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
              selected={selectedImage ? [selectedImage] : []}
              onConfirm={handleImageConfirm}
              single
            />
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
