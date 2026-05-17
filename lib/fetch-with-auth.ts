/**
 * fetchWithAuth — a drop-in wrapper around `fetch` that automatically
 * attempts a token refresh when the server responds with 401, then retries
 * the original request exactly once.
 *
 * Usage:
 *   const res = await fetchWithAuth('/api/protected-route', { method: 'GET' });
 *
 * If the refresh also fails (e.g. refresh token expired), the caller receives
 * the 401 response and should redirect the user to sign-in.
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
    // Refresh failed — return the original 401 so the caller can handle it
    // (e.g. redirect to /sign-in).
    return response;
  }

  // Retry the original request with the newly set cookies.
  return fetch(input, { credentials: 'include', ...init });
}
