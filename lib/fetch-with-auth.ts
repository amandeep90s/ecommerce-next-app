/**
 * fetchWithAuth — a drop-in wrapper around `fetch` that automatically
 * attempts a token refresh when the server responds with 401, then retries
 * the original request exactly once.
 *
 * Usage:
 *   const res = await fetchWithAuth('/api/protected-route', { method: 'GET' });
 *
 * If the refresh also fails (e.g. refresh token expired), a global
 * `auth:session-expired` DOM event is dispatched so that AuthInitializer
 * can clear Redux state and redirect the user to /sign-in.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, { credentials: 'include', ...init });

  if (response.status !== 401) {
    return response;
  }

  // Attempt a silent token refresh.
  const refreshRes = await fetch('/api/auth/refresh-token', {
    method: 'POST',
    credentials: 'include',
  });

  if (!refreshRes.ok) {
    // Both tokens have failed — session is truly expired.
    // Notify the AuthInitializer to clear state and redirect to sign-in.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:session-expired'));
    }
    return response;
  }

  // Retry the original request with the newly set cookies.
  return fetch(input, { credentials: 'include', ...init });
}
