'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';

export interface INotification {
  id: string;
  type: 'new_order' | 'new_support_ticket' | 'new_contact';
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

interface IGetNotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: INotification[];
    unreadCount: number;
  } | null;
}

const NOTIFICATIONS_KEY = ['admin', 'notifications'] as const;

async function getNotifications(): Promise<IGetNotificationsResponse> {
  const response = await fetchWithAuth('/api/admin/notifications');
  return response.json();
}

async function markAsRead(ids: string[] | 'all'): Promise<{ success: boolean }> {
  const response = await fetchWithAuth('/api/admin/notifications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.json();
}

export function useGetNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: getNotifications,
    refetchInterval: 30_000, // Poll every 30s
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}
