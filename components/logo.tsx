import Image from 'next/image';
import React from 'react';

export default function Logo() {
  return (
    <div>
      <Image
        src="/images/logo-black.png"
        alt="Logo"
        width={156}
        height={59}
        className="h-auto w-auto dark:hidden"
        loading="eager"
      />
      <Image
        src="/images/logo-white.png"
        alt="Logo"
        width={156}
        height={59}
        className="hidden h-auto w-auto dark:block"
        loading="eager"
      />
    </div>
  );
}
