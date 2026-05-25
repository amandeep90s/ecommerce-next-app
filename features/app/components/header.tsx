'use client';

import { HeartIcon, MenuIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { MobileMenu } from '@/features/app/components/mobile-menu';
import { Navbar } from '@/features/app/components/navbar';
import { useAppSelector } from '@/store/hooks';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="w-full shadow-sm">
      <div className="container mx-auto flex grid-cols-3 items-center justify-between py-4">
        {/* Logo */}
        <Logo className="h-9 w-auto" />

        {/* Navbar */}
        <Navbar />

        {/* Icons and Buttons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-lg">
            <SearchIcon className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon-lg">
            <HeartIcon className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon-lg" className="relative">
            <ShoppingCartIcon className="h-5 w-5" />
            <Badge
              variant="default"
              className="absolute -top-1 left-full size-4 -translate-x-1/2 rounded-full p-0 text-[10px]"
            >
              10
            </Badge>
          </Button>

          <ThemeToggle size="icon-lg" className="ms-3" />
          {isAuthenticated ? (
            <UserAvatar />
          ) : (
            <Button asChild variant="secondary" size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            className="lg:hidden"
            size="icon-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </header>
  );
}
