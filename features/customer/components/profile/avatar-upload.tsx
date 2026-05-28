'use client';

import { Camera, Trash2 } from 'lucide-react';
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetError,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { setUser } from '@/features/auth/authSlice';
import { useRemoveAvatar, useUpdateAvatar } from '@/features/customer/hooks/use-update-avatar';
import { getInitials } from '@/lib/helpers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function AvatarUpload() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { mutate: updateAvatar, isPending: isUploading } = useUpdateAvatar();
  const { mutate: removeAvatar, isPending: isRemoving } = useRemoveAvatar();

  const isPending = isUploading || isRemoving;

  const handleSuccess = useCallback(
    (results: CloudinaryUploadWidgetResults) => {
      if (results.event !== 'success') return;

      const info = results.info as {
        secure_url: string;
        public_id: string;
      };

      updateAvatar(
        { url: info.secure_url, public_id: info.public_id },
        {
          onSuccess: (res) => {
            if (res.data) dispatch(setUser(res.data));
            toast.success(res.message);
          },
          onError: (error) => {
            const message = error instanceof Error ? error.message : 'Failed to update avatar';
            toast.error(message);
          },
        },
      );
    },
    [updateAvatar, dispatch],
  );

  const handleError = useCallback((error: CloudinaryUploadWidgetError) => {
    const message =
      typeof error === 'string' ? error : (error?.statusText ?? 'Upload failed. Please try again.');
    toast.error(message);
  }, []);

  function handleRemove() {
    removeAvatar(undefined, {
      onSuccess: (res) => {
        if (res.data) dispatch(setUser(res.data));
        toast.success(res.message);
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Failed to remove avatar';
        toast.error(message);
      },
    });
  }

  return (
    <div className="flex items-center gap-4">
      {/* Avatar with upload overlay */}
      <div className="relative size-16">
        <Avatar className="size-16">
          <AvatarImage src={user?.avatar?.url} alt={user?.name || 'User'} />
          <AvatarFallback className="text-lg">
            {user?.name ? getInitials(user.name) : 'U'}
          </AvatarFallback>
        </Avatar>

        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={handleSuccess}
          onError={handleError}
          options={{
            sources: ['local', 'url'],
            multiple: false,
            maxFiles: 1,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxFileSize: 2_000_000, // 2 MB
            cropping: true,
            croppingAspectRatio: 1,
            showSkipCropButton: false,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              disabled={isPending}
              onClick={() => open()}
              className="bg-background border-border hover:bg-muted absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50"
              aria-label="Change avatar"
            >
              {isUploading ? <Spinner className="size-3" /> : <Camera className="size-3" />}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Name / Email + remove button */}
      <div className="flex flex-col gap-0.5">
        <p className="text-lg font-semibold">{user?.name}</p>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
        {user?.avatar?.url && (
          <ConfirmDialog
            trigger={
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="w-fit justify-start text-xs"
                disabled={isPending}
              >
                {isRemoving ? (
                  <Spinner className="mr-1 size-3" />
                ) : (
                  <Trash2 className="mr-1 size-3" />
                )}
                Remove photo
              </Button>
            }
            title="Remove profile photo"
            description="Are you sure you want to remove your profile photo? This action cannot be undone."
            confirmLabel="Remove"
            variant="destructive"
            onConfirm={handleRemove}
            disabled={isPending}
          />
        )}
      </div>
    </div>
  );
}
