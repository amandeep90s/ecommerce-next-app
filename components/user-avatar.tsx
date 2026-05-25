'use client';

import {
  HouseIcon,
  Key,
  LayoutDashboardIcon,
  LogOut,
  ShoppingBagIcon,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ERole } from '@/enums';
import { useSignOut } from '@/features/auth/hooks/use-sign-out';
import { useAppSelector } from '@/store/hooks';

export function UserAvatar() {
  const { mutate: signOut, isPending } = useSignOut();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar?.url} alt={user?.name || 'User'} />
            <AvatarFallback>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <p className="font-medium">{user?.name || 'User'}</p>
          <p className="text-muted-foreground text-xs">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.role === ERole.ADMIN && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer">
                <LayoutDashboardIcon className="mr-2 size-4" />
                <span>My Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={user.role === ERole.USER ? '/profile' : '/admin/profile'}
              className="cursor-pointer"
            >
              <UserIcon className="mr-2 size-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          {user.role === ERole.USER && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">
                  <ShoppingBagIcon className="mr-2 size-4" />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/addresses" className="cursor-pointer">
                  <HouseIcon className="mr-2 size-4" />
                  <span>My Address</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/admin/change-password" className="cursor-pointer">
              <Key className="mr-2 size-4" />
              <span>Change Password</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          onClick={() => signOut()}
          disabled={isPending}
        >
          <LogOut className="mr-2 size-4" />
          <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
