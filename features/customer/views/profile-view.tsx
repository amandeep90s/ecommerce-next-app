'use client';

import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { setUser } from '@/features/auth/authSlice';
import { ProfileForm } from '@/features/customer/components/profile/profile-form';
import { useUpdateProfile } from '@/features/customer/hooks/use-update-profile';
import { type UpdateProfileFormData } from '@/features/customer/validator';
import { handleFormError } from '@/lib/form-error';
import { getInitials } from '@/lib/helpers';
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
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user?.avatar?.url} alt={user?.name || 'User'} />
            <AvatarFallback className="text-lg">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
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
