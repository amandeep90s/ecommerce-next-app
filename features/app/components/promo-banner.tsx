'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const promoBannerData = {
  message: '🎉 Get 20% off your first order with code WELCOME20',
  link: '/shop',
  linkText: 'Shop Now',
  backgroundColor: 'bg-primary',
  textColor: 'text-primary-foreground',
  isDismissible: true,
};

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center px-4 py-3',
        promoBannerData.backgroundColor,
        promoBannerData.textColor,
      )}
    >
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <span>{promoBannerData.message}</span>
        {promoBannerData.link && (
          <Link
            href={promoBannerData.link}
            className="underline underline-offset-4 hover:no-underline"
          >
            {promoBannerData.linkText}
          </Link>
        )}
      </div>

      {promoBannerData.isDismissible && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="hover:bg-primary-foreground/10 absolute right-2"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
