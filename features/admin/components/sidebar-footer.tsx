'use client';

import { ChevronsUpDown, Key, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSignOut } from '@/features/auth/hooks/use-sign-out';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSelector } from '@/store/hooks';

export function AdminSidebarFooter() {
  const { mutate: signOut, isPending } = useSignOut();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const isMobile = useIsMobile();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size={'lg'} className="flex items-center justify-between px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar size="default">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name || 'User'} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
                  </div>
                </div>
                <div className="ml-auto group-data-[collapsible=icon]:hidden">
                  <ChevronsUpDown className="size-4" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={isMobile ? 'top' : 'right'} align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 size-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
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
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
