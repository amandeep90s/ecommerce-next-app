'use client';

import React from 'react';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return <div className="flex min-h-screen min-w-screen flex-col">{children}</div>;
}
