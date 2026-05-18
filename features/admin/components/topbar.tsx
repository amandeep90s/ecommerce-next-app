import React from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Topbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b px-3 py-2">
      <SidebarTrigger />
      <ThemeToggle />
    </nav>
  );
}
