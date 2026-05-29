import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CONTACT_QUERY_KEY } from '@/features/admin/hooks/use-get-contact-submissions';
import { fetchWithAuth } from '@/lib/fetch-with-auth';

async function deleteContactSubmission(id: string): Promise<void> {
  const response = await fetchWithAuth(`/api/contact/${id}`, { method: 'DELETE' });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete submission');
  }
}

export function useDeleteContactSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEY });
    },
  });
}
