import { HandbagIcon } from 'lucide-react';
import Link from 'next/link';

import { SidebarHeader } from '@/components/ui/sidebar';

export function AdminSidebarHeader() {
  return (
    <SidebarHeader className="h-14 flex-row items-center border-b">
      <Link href="/" className="">
        <div className="flex items-center justify-start space-x-2">
          <HandbagIcon className="text-primary h-7 w-auto" />
          <p className="text-foreground text-2xl group-data-[collapsible=icon]:hidden">Estore</p>
        </div>
      </Link>
    </SidebarHeader>
  );
}
