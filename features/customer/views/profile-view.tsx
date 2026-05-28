'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { setUser } from '@/features/auth/authSlice';
import { AvatarUpload } from '@/features/customer/components/profile/avatar-upload';
import { ProfileForm } from '@/features/customer/components/profile/profile-form';
import { useUpdateProfile } from '@/features/customer/hooks/use-update-profile';
import { type UpdateProfileFormData } from '@/features/customer/validator';
import { handleFormError } from '@/lib/form-error';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function ProfileView() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  function onSubmit(formData: UpdateProfileFormData, form: UseFormReturn<UpdateProfileFormData>) {
    updateProfile(formData, {
      onSuccess: (res) => {
        if (res.data) {
          dispatch(setUser(res.data));
        }
        toast.success(res.message);
      },
      onError: (error) => handleFormError(error, form),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar Card */}
      <Card>
        <CardContent>
          <AvatarUpload />
        </CardContent>
      </Card>

      {/* Profile Form */}
      <ProfileForm
        defaultValues={{ name: user?.name ?? '', phone: user?.phone ?? '' }}
        email={user?.email}
        onSubmit={onSubmit}
        isPending={isPending}
      />
    </div>
  );
}
