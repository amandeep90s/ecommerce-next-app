import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { clearUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

async function signOut(): Promise<void> {
  const response = await fetch('/api/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || 'Sign out failed');
  }
}

export function useSignOut() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      dispatch(clearUser());
      router.push('/sign-in');
    },
  });
}
