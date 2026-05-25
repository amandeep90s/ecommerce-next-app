'use client';

import React from 'react';

import Logo from '@/components/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen min-w-screen flex-col items-center justify-center gap-4">
      <Logo className="h-10 w-auto" />
      {children}

      <footer>
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} E-Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
