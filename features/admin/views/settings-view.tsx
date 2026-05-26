'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { SettingsForm } from '@/features/admin/components/settings/settings-form';
import { useGetSettings } from '@/features/admin/hooks/use-get-settings';
import { useUpdateSettings } from '@/features/admin/hooks/use-update-settings';
import { type UpdateSettingsFormData } from '@/features/admin/validator';
import { handleFormError } from '@/lib/form-error';

export function SettingsView() {
  const { data, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const settings = data?.data;

  function onSubmit(formData: UpdateSettingsFormData, form: UseFormReturn<UpdateSettingsFormData>) {
    updateSettings(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return (
    <SettingsForm
      defaultValues={settings}
      isLoading={isLoading}
      isPending={isPending}
      onSubmit={onSubmit}
    />
  );
}
