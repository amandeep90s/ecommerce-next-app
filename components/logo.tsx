import Image from 'next/image';
import React from 'react';

export default function Logo() {
  return (
    <div>
      <Image
        src="/images/logo-black.png"
        alt="Logo"
        width={156}
        height={60}
        className="h-15 w-auto dark:hidden"
        loading="eager"
      />
      <Image
        src="/images/logo-white.png"
        alt="Logo"
        width={156}
        height={60}
        className="hidden h-15 w-auto dark:block"
        loading="eager"
      />
    </div>
  );
}
