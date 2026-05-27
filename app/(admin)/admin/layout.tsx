import { redirect } from 'next/navigation';
import React from 'react';

import { ERole } from '@/enums';
import { AdminLayout } from '@/features/admin/layouts/admin-layout';
import { getServerUser } from '@/lib/get-server-user';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getServerUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== ERole.ADMIN) {
    redirect('/dashboard');
  }

  return <AdminLayout>{children}</AdminLayout>;
}
