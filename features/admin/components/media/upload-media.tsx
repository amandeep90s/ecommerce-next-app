'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useUploadMedia } from '@/features/admin/hooks/use-upload-media';

export function UploadMedia() {
  const { mutate: uploadMedia } = useUploadMedia();

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    if (results.event !== 'success') return;

    const info = results.info as {
      asset_id: string;
      public_id: string;
      secure_url: string;
      thumbnail_url: string;
    };

    uploadMedia(
      {
        asset_id: info.asset_id,
        public_id: info.public_id,
        path: info.secure_url,
        thumbnail_url: info.thumbnail_url,
      },
      {
        onSuccess: () => {
          toast.success('Media uploaded successfully.');
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to save media.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={handleSuccess}
      options={{ sources: ['local', 'url', 'camera'], multiple: true }}
    >
      {({ open }) => (
        <Button variant="default" className="w-fit" onClick={() => open()}>
          Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
}
