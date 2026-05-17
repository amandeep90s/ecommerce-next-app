import { decodeJwt, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { SECRET_KEY } from '@/config/env';
import { IAuthUser } from '@/types';

/**
 * Resolves the currently authenticated user from httpOnly cookies.
 * Safe to call from Server Components, layouts, and pages.
 *
 * Strategy (mirrors proxy.ts — no DB required):
 *  1. Valid access_token  → return user from payload.
 *  2. Expired access_token + valid refresh_token → decode expired access_token for role.
 *     The client AuthInitializer will exchange the refresh_token for a new access_token.
 *  3. Anything else → null (unauthenticated).
 */
export async function getServerUser(): Promise<IAuthUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) return null;

  const secret = new TextEncoder().encode(SECRET_KEY);

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret);
      return {
        id: payload.id as string,
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as IAuthUser['role'],
        avatar: payload.avatar as IAuthUser['avatar'],
        phone: payload.phone as string | undefined,
      };
    } catch (err) {
      const isExpired = err instanceof Error && err.name === 'JWTExpired';
      if (isExpired && refreshToken) {
        try {
          // Verify refresh token is still valid (signature + expiry — no DB needed).
          await jwtVerify(refreshToken, secret);
          // Decode the expired access token to extract user data / role.
          const decoded = decodeJwt(accessToken);
          return {
            id: decoded.id as string,
            name: decoded.name as string,
            email: decoded.email as string,
            role: decoded.role as IAuthUser['role'],
            avatar: decoded.avatar as IAuthUser['avatar'],
            phone: decoded.phone as string | undefined,
          };
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}
