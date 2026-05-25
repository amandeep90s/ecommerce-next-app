import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface LogoProps {
  height?: number;
  width?: number;
  className?: string;
}

export default function Logo({ height = 59, width = 156, className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo-black.png"
        alt="Logo"
        width={width}
        height={height}
        className={cn('h-auto w-auto dark:hidden', className)}
        loading="eager"
      />
      <Image
        src="/images/logo-white.png"
        alt="Logo"
        width={width}
        height={height}
        className={cn('hidden h-auto w-auto dark:block', className)}
        loading="eager"
      />
    </Link>
  );
}
