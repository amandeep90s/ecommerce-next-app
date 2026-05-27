'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { CustomerSidebarFooter } from '@/features/customer/components/sidebar-footer';
import { CustomerSidebarHeader } from '@/features/customer/components/sidebar-header';
import { CustomerSidebarMenu } from '@/features/customer/components/sidebar-menu';

export function CustomerSidebar() {
  return (
    <Sidebar collapsible="icon">
      <CustomerSidebarHeader />
      <CustomerSidebarMenu />
      <CustomerSidebarFooter />
    </Sidebar>
  );
}
