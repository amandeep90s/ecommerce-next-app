import { HandbagIcon } from 'lucide-react';
import Link from 'next/link';

import { SidebarHeader } from '@/components/ui/sidebar';
import { APP_NAME } from '@/config/env';

export function CustomerSidebarHeader() {
  return (
    <SidebarHeader className="h-14 flex-row items-center border-b">
      <Link href="/">
        <div className="flex items-center justify-start space-x-2">
          <HandbagIcon className="text-primary h-7 w-auto" />
          <p className="text-foreground text-2xl font-semibold group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </p>
        </div>
      </Link>
    </SidebarHeader>
  );
}
