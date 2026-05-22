'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseISO } from 'date-fns';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { type CreateCouponFormData, createCouponSchema } from '@/features/admin/validator';

interface CouponFormProps {
  defaultValues?: Partial<CreateCouponFormData>;
  isLoading?: boolean;
  onSubmit: (data: CreateCouponFormData, form: UseFormReturn<CreateCouponFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function CouponForm({
  defaultValues,
  isLoading,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: CouponFormProps) {
  const form = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: '',
      discount: 0,
      minimumPurchase: 0,
      validFrom: '',
      validTo: '',
      isActive: true,
      ...defaultValues,
    },
    mode: 'onSubmit',
  });

  function handleSubmit(data: CreateCouponFormData) {
    onSubmit(data, form);
  }

  const validFromValue = useWatch({ control: form.control, name: 'validFrom' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // validTo must be at least the day after validFrom (or today if validFrom not set)
  const minValidTo = validFromValue
    ? (() => {
        const d = parseISO(validFromValue);
        d.setDate(d.getDate() + 1);
        return d;
      })()
    : today;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Coupon Details</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form id="coupon-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            {/* Code */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input
                    {...field}
                    id="code"
                    placeholder="e.g. SUMMER2024"
                    autoComplete="off"
                    disabled={isPending || isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Discount */}
              <Controller
                name="discount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="discount">Discount (%)</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(num) ? '' : num);
                      }}
                      id="discount"
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Minimum Purchase */}
              <Controller
                name="minimumPurchase"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="minimumPurchase">Minimum Purchase (₹)</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(num) ? '' : num);
                      }}
                      id="minimumPurchase"
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Valid From */}
              <Controller
                name="validFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="validFrom">Valid From</FieldLabel>
                    <DatePicker
                      id="validFrom"
                      value={field.value}
                      onChange={(v) => {
                        field.onChange(v ?? '');
                        // Reset validTo if it's no longer after the new validFrom
                        const currentTo = form.getValues('validTo');
                        if (v && currentTo && currentTo <= v) {
                          form.setValue('validTo', '', { shouldValidate: false });
                        }
                      }}
                      placeholder="Select start date"
                      minDate={today}
                      disabled={isPending || isLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Valid To */}
              <Controller
                name="validTo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="validTo">Valid To</FieldLabel>
                    <DatePicker
                      id="validTo"
                      value={field.value}
                      onChange={(v) => field.onChange(v ?? '')}
                      placeholder="Select end date"
                      minDate={minValidTo}
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <Button type="submit" form="coupon-form" disabled={isPending || isLoading}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
