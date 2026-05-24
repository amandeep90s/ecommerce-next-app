'use client';

import { Bell, StoreIcon } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserAvatar } from '@/components/user-avatar';
import { GlobalSearch } from '@/features/admin/components/global-search';

export function Topbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b px-3 py-2">
      <SidebarTrigger />

      <GlobalSearch />

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" title="Go to store" asChild>
          <Link href="/">
            <StoreIcon className="size-5" />
          </Link>
        </Button>
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
