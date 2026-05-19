'use client';

import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMediaById } from '@/features/admin/hooks/use-get-media-by-id';
import { useUpdateMedia } from '@/features/admin/hooks/use-update-media';

interface MediaEditViewProps {
  id: string;
}

interface AltForm {
  alt: string;
}

export function MediaEditView({ id }: MediaEditViewProps) {
  const { data, isLoading } = useGetMediaById(id);
  const { mutate: update, isPending } = useUpdateMedia(id);

  const media = data?.data;

  const { register, handleSubmit, reset } = useForm<AltForm>({
    defaultValues: { alt: '' },
  });

  // Populate form once data loads
  useEffect(() => {
    if (media) {
      reset({ alt: media.alt ?? '' });
    }
  }, [media, reset]);

  function onSubmit(values: AltForm) {
    update(
      { alt: values.alt },
      {
        onSuccess: () => toast.success('Alt text saved.'),
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Failed to save alt text.';
          toast.error(message);
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Image</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <ImageIcon className="size-4" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="aspect-square w-full rounded-lg" />
            ) : media ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image
                  src={media.path}
                  alt={media.alt || media.public_id}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Image not found.</p>
            )}
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-28 rounded" />
              </div>
            ) : media ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input id="alt" placeholder="Describe the image…" {...register('alt')} />
                  <p className="text-muted-foreground text-xs">
                    Used by screen readers and as fallback text when the image fails to load.
                  </p>
                </div>

                <div className="text-muted-foreground flex flex-col gap-1 text-xs">
                  <span>
                    <strong>File:</strong> {media.public_id}
                  </span>
                  <span>
                    <strong>Uploaded:</strong> {new Date(media.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving…' : 'Save'}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/admin/media">
                      <ArrowLeftIcon />
                      Back
                    </Link>
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-muted-foreground text-sm">Media not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
