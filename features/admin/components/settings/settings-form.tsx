'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { type UpdateSettingsFormData, updateSettingsSchema } from '@/features/admin/validator';
import type { ISettingsItem } from '@/types';

interface SettingsFormProps {
  defaultValues?: ISettingsItem | null;
  isLoading?: boolean;
  isPending: boolean;
  onSubmit: (data: UpdateSettingsFormData, form: UseFormReturn<UpdateSettingsFormData>) => void;
}

export function SettingsForm({ defaultValues, isLoading, isPending, onSubmit }: SettingsFormProps) {
  const form = useForm<UpdateSettingsFormData>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      storeName: '',
      storeEmail: '',
      storePhone: '',
      storeAddress: '',
      logoUrl: '',
      currency: 'USD',
      currencySymbol: '$',
      socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' },
      seoMetaTitle: '',
      seoMetaDescription: '',
      maintenanceMode: false,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        storeName: defaultValues.storeName ?? '',
        storeEmail: defaultValues.storeEmail ?? '',
        storePhone: defaultValues.storePhone ?? '',
        storeAddress: defaultValues.storeAddress ?? '',
        logoUrl: defaultValues.logoUrl ?? '',
        currency: defaultValues.currency ?? 'USD',
        currencySymbol: defaultValues.currencySymbol ?? '$',
        socialLinks: {
          facebook: defaultValues.socialLinks?.facebook ?? '',
          twitter: defaultValues.socialLinks?.twitter ?? '',
          instagram: defaultValues.socialLinks?.instagram ?? '',
          youtube: defaultValues.socialLinks?.youtube ?? '',
        },
        seoMetaTitle: defaultValues.seoMetaTitle ?? '',
        seoMetaDescription: defaultValues.seoMetaDescription ?? '',
        maintenanceMode: defaultValues.maintenanceMode ?? false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.storeName]);

  function handleSubmit(data: UpdateSettingsFormData) {
    onSubmit(data, form);
  }

  const disabled = isPending || isLoading;

  return (
    <form id="settings-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* ─── General ─────────────────────────────────────────────────── */}
        <TabsContent value="general" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Store Information</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <FieldGroup>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Controller
                    name="storeName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
                        <Input
                          {...field}
                          id="storeName"
                          placeholder="My Awesome Store"
                          disabled={disabled}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="storeEmail"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="storeEmail">Store Email</FieldLabel>
                        <Input
                          {...field}
                          id="storeEmail"
                          type="email"
                          placeholder="hello@store.com"
                          disabled={disabled}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="storePhone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="storePhone">Phone Number</FieldLabel>
                        <Input
                          {...field}
                          id="storePhone"
                          placeholder="+1 555-000-0000"
                          disabled={disabled}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="logoUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>
                        <Input
                          {...field}
                          id="logoUrl"
                          placeholder="https://cdn.example.com/logo.png"
                          disabled={disabled}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="currency"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="currency">Currency Code</FieldLabel>
                        <Input {...field} id="currency" placeholder="USD" disabled={disabled} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="currencySymbol"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="currencySymbol">Currency Symbol</FieldLabel>
                        <Input {...field} id="currencySymbol" placeholder="$" disabled={disabled} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="storeAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="storeAddress">Store Address</FieldLabel>
                      <Textarea
                        {...field}
                        id="storeAddress"
                        rows={3}
                        placeholder="123 Main St, New York, NY 10001"
                        disabled={disabled}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Social ──────────────────────────────────────────────────── */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Social Media Links</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <FieldGroup>
                <div className="grid gap-4 lg:grid-cols-2">
                  {(['facebook', 'twitter', 'instagram', 'youtube'] as const).map((platform) => (
                    <Controller
                      key={platform}
                      name={`socialLinks.${platform}`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                          <FieldLabel htmlFor={platform} className="capitalize">
                            {platform === 'twitter' ? 'Twitter / X' : platform}
                          </FieldLabel>
                          <Input
                            {...field}
                            id={platform}
                            placeholder={`https://${platform}.com/yourpage`}
                            disabled={disabled}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  ))}
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── SEO ─────────────────────────────────────────────────────── */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Search Engine Optimisation</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <FieldGroup>
                <Controller
                  name="seoMetaTitle"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="seoMetaTitle">Meta Title</FieldLabel>
                      <Input
                        {...field}
                        id="seoMetaTitle"
                        placeholder="My Store — Best Products Online"
                        disabled={disabled}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="seoMetaDescription"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="seoMetaDescription">Meta Description</FieldLabel>
                      <Textarea
                        {...field}
                        id="seoMetaDescription"
                        rows={3}
                        placeholder="Discover the best products at unbeatable prices."
                        disabled={disabled}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Advanced ────────────────────────────────────────────────── */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Advanced</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <Controller
                name="maintenanceMode"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Switch
                      id="maintenanceMode"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                    <Label htmlFor="maintenanceMode" className="cursor-pointer">
                      Maintenance Mode
                      <span className="text-muted-foreground ml-2 text-xs font-normal">
                        When enabled, public pages will show a maintenance notice.
                      </span>
                    </Label>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save button — always visible below tabs */}
      <div className="mt-4 flex justify-end">
        <Button type="submit" form="settings-form" disabled={disabled}>
          {isPending ? <Spinner className="mr-2" /> : null}
          {isPending ? 'Saving…' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
