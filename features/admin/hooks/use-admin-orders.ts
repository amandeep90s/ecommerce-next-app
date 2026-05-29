import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetAdminOrdersResponse, IGetOrderByIdResponse, OrderStatus } from '@/types';

export const ADMIN_ORDER_QUERY_KEY = ['admin', 'orders'] as const;

// ─── List ─────────────────────────────────────────────────────────────────────

interface GetOrdersParams {
  page: number;
  limit?: number;
  q?: string;
  status?: string;
}

async function getOrders(params: GetOrdersParams): Promise<IGetAdminOrdersResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: (params.limit ?? 10).toString(),
  });
  if (params.q) searchParams.set('q', params.q);
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);

  const response = await fetchWithAuth(`/api/admin/orders?${searchParams}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch orders');
  return result;
}

export function useGetAdminOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: [
      ...ADMIN_ORDER_QUERY_KEY,
      params.status ?? 'all',
      params.page,
      params.limit ?? 10,
      params.q ?? '',
    ],
    queryFn: () => getOrders(params),
  });
}

// ─── Single ───────────────────────────────────────────────────────────────────

async function getOrderById(id: string): Promise<IGetOrderByIdResponse> {
  const response = await fetchWithAuth(`/api/admin/orders/${id}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch order');
  return result;
}

export function useGetAdminOrderById(id: string) {
  return useQuery({
    queryKey: [...ADMIN_ORDER_QUERY_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}

// ─── Update status ────────────────────────────────────────────────────────────

async function updateOrderStatus({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}): Promise<IGetOrderByIdResponse> {
  const response = await fetchWithAuth(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update order');
  return result;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ADMIN_ORDER_QUERY_KEY, variables.id] });
    },
  });
}
