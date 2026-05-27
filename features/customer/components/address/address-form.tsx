'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getDataCitys, getDataCountrys, getDataStates } from 'country-state-city-nextjs';
import { useEffect, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { EAddressType } from '@/enums';
import { type AddressFormData, addressSchema } from '@/features/customer/validator';
import type { IAddress } from '@/types';

interface CountryOption {
  id: number;
  text: string;
  code: string;
}

interface StateOption {
  id: number;
  id_country: number;
  text: string;
}

interface CityOption {
  id: number;
  id_state: number;
  id_country: number;
  text: string;
}

interface AddressFormProps {
  defaultValues?: Partial<IAddress>;
  onSubmit: (data: AddressFormData, form: UseFormReturn<AddressFormData>) => void;
  isPending: boolean;
  submitLabel?: string;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save Address',
}: AddressFormProps) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [allStates, setAllStates] = useState<StateOption[]>([]);
  const [allCities, setAllCities] = useState<CityOption[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      country: '',
      state: '',
      city: '',
      postal_code: '',
      type: EAddressType.SHIPPING,
      is_default: false,
      ...defaultValues,
    },
    mode: 'onSubmit',
  });

  const watchedCountry = useWatch({ control: form.control, name: 'country' });
  const watchedState = useWatch({ control: form.control, name: 'state' });

  // Load geographic data once
  useEffect(() => {
    async function load() {
      try {
        const [c, s, ci] = await Promise.all([getDataCountrys(), getDataStates(), getDataCitys()]);
        // Deduplicate countries by text — the library contains duplicate name entries
        const seen = new Set<string>();
        const uniqueCountries = (c as CountryOption[]).filter((country) => {
          if (seen.has(country.text)) return false;
          seen.add(country.text);
          return true;
        });
        setCountries(uniqueCountries);
        setAllStates(s as StateOption[]);
        setAllCities(ci as CityOption[]);
      } finally {
        setIsLoadingGeo(false);
      }
    }
    load();
  }, []);

  // Reset state & city when country changes
  useEffect(() => {
    if (!defaultValues?.country || form.formState.isDirty) {
      form.setValue('state', '');
      form.setValue('city', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCountry]);

  // Reset city when state changes
  useEffect(() => {
    if (!defaultValues?.state || form.formState.isDirty) {
      form.setValue('city', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedState]);

  // Derive filtered options
  const selectedCountry = useMemo(
    () => countries.find((c) => c.text === watchedCountry),
    [countries, watchedCountry],
  );

  const filteredStates = useMemo(
    () => (selectedCountry ? allStates.filter((s) => s.id_country === selectedCountry.id) : []),
    [allStates, selectedCountry],
  );

  const selectedState = useMemo(
    () => filteredStates.find((s) => s.text === watchedState),
    [filteredStates, watchedState],
  );

  const filteredCities = useMemo(
    () => (selectedState ? allCities.filter((c) => c.id_state === selectedState.id) : []),
    [allCities, selectedState],
  );

  function handleSubmit(data: AddressFormData) {
    onSubmit(data, form);
  }

  return (
    <form id="address-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
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

          {/* Phone */}
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
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

          {/* Address Line 1 */}
          <Controller
            name="address_line1"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="sm:col-span-2" data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="address_line1">Address Line 1</FieldLabel>
                <Input
                  {...field}
                  id="address_line1"
                  placeholder="Street address, house number"
                  autoComplete="address-line1"
                  disabled={isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Address Line 2 */}
          <Controller
            name="address_line2"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="sm:col-span-2" data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="address_line2">
                  Address Line 2{' '}
                  <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="address_line2"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  autoComplete="address-line2"
                  disabled={isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Country */}
          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || isLoadingGeo}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder={isLoadingGeo ? 'Loading…' : 'Select country'} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.text}>
                        {c.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* State */}
          <Controller
            name="state"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="state">State / Province</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !watchedCountry || filteredStates.length === 0}
                >
                  <SelectTrigger id="state">
                    <SelectValue
                      placeholder={
                        !watchedCountry
                          ? 'Select country first'
                          : filteredStates.length === 0
                            ? 'No states available'
                            : 'Select state'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStates.map((s) => (
                      <SelectItem key={s.id} value={s.text}>
                        {s.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* City */}
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || !watchedState || filteredCities.length === 0}
                >
                  <SelectTrigger id="city">
                    <SelectValue
                      placeholder={
                        !watchedState
                          ? 'Select state first'
                          : filteredCities.length === 0
                            ? 'No cities available'
                            : 'Select city'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCities.map((c) => (
                      <SelectItem key={c.id} value={c.text}>
                        {c.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Postal Code */}
          <Controller
            name="postal_code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
                <Input
                  {...field}
                  id="postal_code"
                  placeholder="e.g. 110001"
                  autoComplete="postal-code"
                  disabled={isPending}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Address Type */}
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="type">Address Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EAddressType.SHIPPING}>Shipping</SelectItem>
                    <SelectItem value={EAddressType.BILLING}>Billing</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Is Default */}
          <Controller
            name="is_default"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className="col-span-2"
                orientation="horizontal"
                data-invalid={fieldState?.invalid || undefined}
              >
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  id="is_default"
                  aria-invalid={fieldState.invalid || undefined}
                  disabled={isPending}
                />
                <FieldLabel htmlFor="is_default">Set as default address</FieldLabel>
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="mt-6 flex justify-end">
        <Button type="submit" form="address-form" disabled={isPending}>
          {isPending && <Spinner className="mr-2 size-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
