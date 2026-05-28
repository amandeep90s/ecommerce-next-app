'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IMediaItem } from '@/types';

interface ProductImageGalleryProps {
  images: IMediaItem[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allImages =
    images.length > 0
      ? images
      : [{ id: 'placeholder', path: '/images/placeholder.png', alt: productName } as IMediaItem];
  const selected = allImages[selectedIndex];

  function prev() {
    setSelectedIndex((i) => (i - 1 + allImages.length) % allImages.length);
  }

  function next() {
    setSelectedIndex((i) => (i + 1) % allImages.length);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={selected.path}
          alt={selected.alt ?? productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        {allImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={prev}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight className="size-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:shrink-0 sm:flex-col sm:overflow-x-visible">
          {allImages.map((img, i) => (
            <button
              key={img.id ?? i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:w-full',
                i === selectedIndex
                  ? 'border-primary'
                  : 'hover:border-muted-foreground/40 border-transparent',
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.thumbnail_url || img.path}
                alt={img.alt ?? `${productName} ${i + 1}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
