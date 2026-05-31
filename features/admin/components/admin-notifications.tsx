'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  BellIcon,
  CheckCheckIcon,
  InboxIcon,
  MailIcon,
  PackageIcon,
  TicketIcon,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  type INotification,
  useGetNotifications,
  useMarkNotificationsRead,
} from '@/features/admin/hooks/use-notifications';
import { cn } from '@/lib/utils';

function getNotificationIcon(type: INotification['type']) {
  switch (type) {
    case 'new_order':
      return <PackageIcon className="size-4 text-blue-500" />;
    case 'new_support_ticket':
      return <TicketIcon className="size-4 text-orange-500" />;
    case 'new_contact':
      return <MailIcon className="size-4 text-green-500" />;
  }
}

function getNotificationLink(notification: INotification): string | undefined {
  switch (notification.type) {
    case 'new_order':
      return notification.referenceId
        ? `/admin/orders/${notification.referenceId}`
        : '/admin/orders';
    case 'new_support_ticket':
      return notification.referenceId
        ? `/admin/support-tickets/${notification.referenceId}`
        : '/admin/support-tickets';
    case 'new_contact':
      return '/admin/contact';
    default:
      return undefined;
  }
}

export function AdminNotifications() {
  const { data } = useGetNotifications();
  const { mutate: markRead } = useMarkNotificationsRead();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const handleMarkAllRead = () => {
    if (unreadCount > 0) markRead('all');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 left-full size-4 -translate-x-1/2 rounded-full p-0 pt-0.5 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 pt-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
              onClick={handleMarkAllRead}
            >
              <CheckCheckIcon className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <InboxIcon className="text-muted-foreground mb-2 size-8" />
            <p className="text-muted-foreground text-sm">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="flex flex-col">
              {notifications.map((notification) => {
                const link = getNotificationLink(notification);
                const content = (
                  <div
                    key={notification.id}
                    className={cn(
                      'hover:bg-muted/50 flex gap-3 px-4 pb-3 transition-colors',
                      !notification.isRead && 'bg-muted/30',
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{notification.title}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                );

                return link ? (
                  <Link key={notification.id} href={link} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
