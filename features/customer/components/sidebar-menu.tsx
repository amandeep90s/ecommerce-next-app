'use client';

import { HeartIcon, HomeIcon, KeyIcon, MapPinIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function CustomerSidebarMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <HomeIcon />,
      },
      {
        label: 'My Orders',
        href: '/orders',
        icon: <ShoppingBagIcon />,
      },
      {
        label: 'My Wishlist',
        href: '/wishlist',
        icon: <HeartIcon />,
      },
      {
        label: 'My Addresses',
        href: '/addresses',
        icon: <MapPinIcon />,
      },
      {
        label: 'My Profile',
        href: '/profile',
        icon: <UserIcon />,
      },
      {
        label: 'Change Password',
        href: '/change-password',
        icon: <KeyIcon />,
      },
    ],
    [],
  );

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
          My Account
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label} isActive={isActive(item.href)}>
                  <Link href={item.href}>
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
