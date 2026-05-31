import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchWithAuth } from '@/lib/fetch-with-auth';

export const WISHLIST_QUERY_KEY = ['customer', 'wishlist'] as const;

export interface WishlistProduct {
  productId: {
    id: string;
    name: string;
    slug: string;
    price: number;
    selling_price: number;
    discount: number;
    stock: number;
    media: { path: string; alt?: string }[];
    category: { name: string; slug: string };
  };
  addedAt: string;
  _id: string;
}

export interface IGetWishlistResponse {
  success: boolean;
  message: string;
  data: WishlistProduct[] | null;
}

// ─── Fetch ─────────────────────────────────────────────────────────────────

async function getWishlist(): Promise<IGetWishlistResponse> {
  const response = await fetchWithAuth('/api/wishlist');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch wishlist');
  return result;
}

export function useGetWishlist({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getWishlist,
    enabled,
  });
}

// ─── Add to Wishlist ───────────────────────────────────────────────────────

async function addToWishlist(productId: string): Promise<IGetWishlistResponse> {
  const response = await fetchWithAuth('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to add to wishlist');
  return result;
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}

// ─── Remove from Wishlist ──────────────────────────────────────────────────

async function removeFromWishlist(productId: string): Promise<IGetWishlistResponse> {
  const response = await fetchWithAuth(`/api/wishlist?productId=${productId}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to remove from wishlist');
  return result;
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}
