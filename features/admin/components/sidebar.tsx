'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { AdminSidebarFooter } from '@/features/admin/components/sidebar-footer';
import { AdminSidebarHeader } from '@/features/admin/components/sidebar-header';
import { AdminSidebarMenu } from '@/features/admin/components/sidebar-menu';

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AdminSidebarHeader />
      <AdminSidebarMenu />
      <AdminSidebarFooter />
    </Sidebar>
  );
}
