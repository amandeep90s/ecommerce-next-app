'use client';

import React from 'react';

import { Footer } from '@/components/footer';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/features/admin/components/sidebar';
import { Topbar } from '@/features/admin/components/topbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="flex w-full flex-col">
        <Topbar />
        <div className="grow p-4">{children}</div>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
