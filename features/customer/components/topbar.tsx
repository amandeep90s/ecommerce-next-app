'use client';

import { StoreIcon } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function CustomerTopbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b px-3 py-2">
      <SidebarTrigger />

      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" title="Go to store" asChild>
          <Link href="/">
            <StoreIcon className="size-5" />
          </Link>
        </Button>

        <ThemeToggle />
      </div>
    </nav>
  );
}
