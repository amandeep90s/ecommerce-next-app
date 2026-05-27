import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusCodes } from 'http-status-codes';

import type { AddressFormData } from '@/features/customer/validator';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { ValidationError } from '@/lib/form-error';
import type { IAddress } from '@/types';

export const ADDRESS_QUERY_KEY = ['customer', 'addresses'] as const;

// ─── Fetch ─────────────────────────────────────────────────────────────────

async function getAddresses(): Promise<{ data: IAddress[] }> {
  const response = await fetchWithAuth('/api/addresses');
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to fetch addresses');
  return result;
}

export function useGetAddresses() {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEY,
    queryFn: getAddresses,
  });
}

// ─── Create ────────────────────────────────────────────────────────────────

async function createAddress(data: AddressFormData): Promise<{ data: IAddress }> {
  const response = await fetchWithAuth('/api/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<AddressFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to create address');
  }
  return result;
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
  });
}

// ─── Update ────────────────────────────────────────────────────────────────

async function updateAddress({
  id,
  data,
}: {
  id: string;
  data: AddressFormData;
}): Promise<{ data: IAddress }> {
  const response = await fetchWithAuth(`/api/addresses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY && result.errors) {
      throw new ValidationError<AddressFormData>(result.message, result.errors);
    }
    throw new Error(result.message || 'Failed to update address');
  }
  return result;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
  });
}

// ─── Set Default ───────────────────────────────────────────────────────────

async function setDefaultAddress(id: string): Promise<{ data: IAddress }> {
  const response = await fetchWithAuth(`/api/addresses/${id}`, { method: 'PATCH' });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to set default address');
  return result;
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
  });
}

// ─── Delete ────────────────────────────────────────────────────────────────

async function deleteAddress(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/addresses/${id}`, { method: 'DELETE' });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete address');
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
  });
}
