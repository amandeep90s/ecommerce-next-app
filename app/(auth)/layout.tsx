import React from 'react';

import { AuthLayout } from '@/features/auth/layouts/auth-layout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
