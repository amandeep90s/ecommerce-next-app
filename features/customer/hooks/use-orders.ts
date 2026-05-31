import { useQuery } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { IGetCustomerOrderByIdResponse, IGetCustomerOrdersResponse } from '@/types';

export const ORDERS_QUERY_KEY = ['customer', 'orders'] as const;

// ─── Fetch list ────────────────────────────────────────────────────────────

async function getOrders(): Promise<IGetCustomerOrdersResponse> {
  const response = await fetchWithAuth('/api/orders');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch orders');
  return result;
}

export function useGetOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getOrders,
  });
}

// ─── Fetch single ──────────────────────────────────────────────────────────

async function getOrderById(id: string): Promise<IGetCustomerOrderByIdResponse> {
  const response = await fetchWithAuth(`/api/orders/${id}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch order');
  return result;
}

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
}
