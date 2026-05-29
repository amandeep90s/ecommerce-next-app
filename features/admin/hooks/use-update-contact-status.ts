import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CONTACT_QUERY_KEY } from '@/features/admin/hooks/use-get-contact-submissions';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import type { ContactStatus, IUpdateContactStatusResponse } from '@/types';

interface UpdateContactStatusPayload {
  id: string;
  status: ContactStatus;
}

async function updateContactStatus({
  id,
  status,
}: UpdateContactStatusPayload): Promise<IUpdateContactStatusResponse> {
  const response = await fetchWithAuth(`/api/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update status');
  }

  return result;
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEY });
    },
  });
}
