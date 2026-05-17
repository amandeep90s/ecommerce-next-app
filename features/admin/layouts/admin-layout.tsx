'use client';

import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="flex min-h-screen min-w-screen flex-col">{children}</div>;
}
