'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { ChangePasswordForm } from '@/features/customer/components/profile/change-password-form';
import { useChangePassword } from '@/features/customer/hooks/use-change-password';
import { type ChangePasswordFormData } from '@/features/customer/validator';
import { handleFormError } from '@/lib/form-error';

export function ChangePasswordView() {
  const { mutate: changePassword, isPending } = useChangePassword();

  function onSubmit(formData: ChangePasswordFormData, form: UseFormReturn<ChangePasswordFormData>) {
    changePassword(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
        form.reset();
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return <ChangePasswordForm onSubmit={onSubmit} isPending={isPending} />;
}
