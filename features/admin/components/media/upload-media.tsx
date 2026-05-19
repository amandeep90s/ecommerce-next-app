'use client';

import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { MEDIA_QUERY_KEY } from '@/features/admin/hooks/use-get-media';
import { useUploadMediaBatch } from '@/features/admin/hooks/use-upload-media';
import { IUploadMediaPayload } from '@/types';

interface UploadMediaProps {
  isMultiple?: boolean;
}

export function UploadMedia({ isMultiple = true }: UploadMediaProps) {
  const collectedFilesRef = useRef<IUploadMediaPayload[]>([]);
  const { mutate: uploadMediaBatch } = useUploadMediaBatch();
  const queryClient = useQueryClient();

  const handleSuccess = useCallback((results: CloudinaryUploadWidgetResults) => {
    if (results.event !== 'success') return;

    const info = results.info as {
      asset_id: string;
      public_id: string;
      secure_url: string;
      thumbnail_url: string;
    };

    collectedFilesRef.current = [
      ...collectedFilesRef.current,
      {
        asset_id: info.asset_id,
        public_id: info.public_id,
        path: info.secure_url,
        thumbnail_url: info.thumbnail_url,
      },
    ];
  }, []);

  // CloudinaryUploadWidgetError = string | { status: string; statusText: string } | undefined
  const handleError = useCallback((error: CloudinaryUploadWidgetError) => {
    const message =
      typeof error === 'string' ? error : (error?.statusText ?? 'Upload failed. Please try again.');
    toast.error(message);
  }, []);

  // onQueuesEnd receives the same results shape + a widget ref in the second arg
  const handleQueuesEnd = useCallback(() => {
    const files = collectedFilesRef.current;
    if (files.length === 0) return;

    uploadMediaBatch(
      { files },
      {
        onSuccess: () => {
          toast.success(`${files.length} media file(s) uploaded successfully.`);
          collectedFilesRef.current = [];
          queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEY });
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to save media.';
          toast.error(message);
        },
      },
    );
  }, [queryClient, uploadMediaBatch]);

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={handleSuccess}
      onError={handleError}
      onQueuesEnd={handleQueuesEnd}
      options={{ sources: ['local', 'url', 'google_drive', 'unsplash'], multiple: isMultiple }}
    >
      {({ open }) => (
        <Button variant="default" className="w-fit" onClick={() => open()}>
          <PlusIcon className="size-4" />
          Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
}
