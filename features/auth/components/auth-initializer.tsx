'use client';

import { useEffect, useRef } from 'react';

import { clearUser, setUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { IAuthUser } from '@/types';

async function fetchMe(): Promise<IAuthUser | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (res.ok) {
    const json = await res.json();
    return json.data as IAuthUser;
  }
  return null;
}

async function refreshAndFetchUser(): Promise<IAuthUser | null> {
  const res = await fetch('/api/auth/refresh-token', {
    method: 'POST',
    credentials: 'include',
  });
  if (res.ok) {
    const json = await res.json();
    return json.data as IAuthUser;
  }
  return null;
}

/**
 * Invisible component that rehydrates the Redux auth state from the
 * httpOnly cookies on every full-page load / navigation.
 *
 * Mount order: StoreProvider → AuthInitializer → rest of the app.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      // 1. Try to get user from a valid access token.
      let user = await fetchMe();

      // 2. If access token is expired/missing, try the refresh token.
      if (!user) {
        user = await refreshAndFetchUser();
      }

      // 3. Hydrate the store — or clear it if both failed (unauthenticated).
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);

  return null;
}
