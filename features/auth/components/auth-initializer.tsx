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
 * Also handles two additional scenarios:
 *  - Tokens expiring while the user is idle on a page (visibilitychange re-check).
 *  - fetchWithAuth reporting a final 401 via the `auth:session-expired` event.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const hasMounted = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      let user = await fetchMe();
      if (!user) user = await refreshAndFetchUser();

      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
        // Redirect to sign-in if currently on a protected route.
        const { pathname } = window.location;
        const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/customer');
        if (isProtected) {
          window.location.href = '/sign-in';
        }
      }
    };

    // Run once on first mount to hydrate the store.
    if (!hasMounted.current) {
      hasMounted.current = true;
      checkAuth();
    }

    // Re-check when the user returns to the tab after a long idle period
    // (e.g. tokens may have expired while the tab was in the background).
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    // Handle session expiry reported by fetchWithAuth (both tokens failed).
    const onSessionExpired = () => {
      dispatch(clearUser());
      window.location.href = '/sign-in';
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('auth:session-expired', onSessionExpired);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('auth:session-expired', onSessionExpired);
    };
  }, [dispatch]);

  return null;
}
