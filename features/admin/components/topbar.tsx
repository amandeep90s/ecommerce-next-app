'use client';

import { Bell } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserAvatar } from '@/components/user-avatar';

export function Topbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b px-3 py-2">
      <SidebarTrigger />

      <div>Search Component</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
        </Button>

        <ThemeToggle />

        <UserAvatar />
      </div>
    </nav>
  );
}
