'use client';

import React from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import { AdminSidebar } from '../components/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <main className="w-full">
        <nav className="flex h-14 items-center justify-between border-b px-3 py-2">
          <SidebarTrigger />
          <ThemeToggle />
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
