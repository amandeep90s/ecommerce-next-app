'use client';

import {
  ChevronDown,
  HomeIcon,
  ImageIcon,
  LayoutGridIcon,
  ListIcon,
  Package2Icon,
  PackageIcon,
  Plus,
  ShoppingCartIcon,
  StarIcon,
  TicketIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  subMenu?: MenuItem[];
}

export function AdminSidebarMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: <HomeIcon />,
      },
      {
        label: 'Customers',
        href: '/admin/customers',
        icon: <UsersIcon />,
      },
      {
        label: 'Orders',
        href: '/admin/orders',
        icon: <ShoppingCartIcon />,
      },
      {
        label: 'Categories',
        href: '/admin/categories',
        icon: <LayoutGridIcon />,
        subMenu: [
          {
            label: 'All Categories',
            href: '/admin/categories',
            icon: <ListIcon />,
          },
          {
            label: 'Add Category',
            href: '/admin/categories/new',
            icon: <Plus />,
          },
        ],
      },
      {
        label: 'Products',
        href: '/admin/products',
        icon: <PackageIcon />,
        subMenu: [
          {
            label: 'All Products',
            href: '/admin/products',
            icon: <PackageIcon />,
          },
          {
            label: 'Add Product',
            href: '/admin/products/new',
            icon: <Plus />,
          },
          {
            label: 'All Variants',
            href: '/admin/products/variants',
            icon: <Package2Icon />,
          },
          {
            label: 'Add Variant',
            href: '/admin/products/variants/new',
            icon: <Plus />,
          },
        ],
      },
      {
        label: 'Coupons',
        href: '/admin/coupons',
        icon: <TicketIcon />,
        subMenu: [
          {
            label: 'All Coupons',
            href: '/admin/coupons',
            icon: <TicketIcon />,
          },
          {
            label: 'Add Coupon',
            href: '/admin/coupons/new',
            icon: <Plus />,
          },
        ],
      },
      {
        label: 'Rating & Reviews',
        href: '/admin/reviews',
        icon: <StarIcon />,
      },
      {
        label: 'Media',
        href: '/admin/media',
        icon: <ImageIcon />,
      },
    ];
  }, []);

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
          Main Menu
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => {
              const parentIsActive =
                isActive(item.href) || (item.subMenu?.some((sub) => isActive(sub.href)) ?? false);

              return item.subMenu ? (
                <Collapsible
                  key={item.href}
                  asChild
                  className="group/collapsible"
                  defaultOpen={parentIsActive}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.label} isActive={parentIsActive}>
                        {item.icon}
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subMenu.map((sub) => (
                          <SidebarMenuSubItem key={sub.href}>
                            <SidebarMenuSubButton asChild isActive={isActive(sub.href)}>
                              <Link href={sub.href}>
                                {sub.icon}
                                <span className="group-data-[collapsible=icon]:hidden">
                                  {sub.label}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      {item.icon}
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
