'use client';

import React from 'react';

import { Footer } from '@/features/app/components/footer';
import { Header } from '@/features/app/components/header';
import { PromoBanner } from '@/features/app/components/promo-banner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <PromoBanner />
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </>
  );
}
