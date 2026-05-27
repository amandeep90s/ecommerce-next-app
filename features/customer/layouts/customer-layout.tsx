'use client';

import React from 'react';

import { Footer } from '@/components/footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CustomerSidebar } from '@/features/customer/components/sidebar';
import { CustomerTopbar } from '@/features/customer/components/topbar';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <SidebarProvider>
      <CustomerSidebar />

      <main className="flex w-full flex-col">
        <CustomerTopbar />
        <div className="grow p-4">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
