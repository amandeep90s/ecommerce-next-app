import { decodeJwt, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ERole } from '@/enums';

const AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/email-verification',
];

function getDashboard(role: string) {
  return role === ERole.ADMIN ? '/admin/dashboard' : '/customer/dashboard';
}

interface TokenPayload {
  role?: string;
}

async function resolveUser(
  accessToken: string | undefined,
  refreshToken: string | undefined,
): Promise<{ isAuthenticated: boolean; payload: TokenPayload | null }> {
  if (!accessToken && !refreshToken) {
    return { isAuthenticated: false, payload: null };
  }

  // Secret is needed in all branches — define it once here.
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret);
      return { isAuthenticated: true, payload: payload as TokenPayload };
    } catch (err) {
      const isExpired = err instanceof Error && err.name === 'JWTExpired';
      if (isExpired && refreshToken) {
        // Access token is expired — verify the refresh token signature + expiry
        // before trusting it (no DB needed, just JWT validation).
        try {
          await jwtVerify(refreshToken, secret);
          // Refresh token is valid → decode the expired access token to retain role.
          // The client AuthInitializer will silently exchange it for a new access token.
          const decoded = decodeJwt(accessToken) as TokenPayload;
          return { isAuthenticated: true, payload: decoded };
        } catch {
          // Refresh token is also expired/tampered → session is truly dead.
          return { isAuthenticated: false, payload: null };
        }
      }
      // Access token is invalid (not just expired) → unauthenticated.
      return { isAuthenticated: false, payload: null };
    }
  }

  // No access token but refresh token present — verify it before trusting.
  if (refreshToken) {
    try {
      await jwtVerify(refreshToken, secret);
      // Valid refresh token but no access token — authenticated but role is unknown.
      // The client AuthInitializer will fetch /api/auth/me or refresh transparently.
      return { isAuthenticated: true, payload: null };
    } catch {
      return { isAuthenticated: false, payload: null };
    }
  }

  return { isAuthenticated: false, payload: null };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const { isAuthenticated, payload } = await resolveUser(accessToken, refreshToken);
  const role = payload?.role;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = pathname.startsWith('/admin');
  const isCustomerRoute = pathname.startsWith('/customer');

  // ── Authenticated users must not see auth pages ───────────────────────────
  if (isAuthRoute && isAuthenticated) {
    const destination = role ? getDashboard(role) : '/';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // ── Admin routes: must be authenticated + admin role ─────────────────────
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (role && role !== ERole.ADMIN) {
      return NextResponse.redirect(new URL('/customer/dashboard', request.url));
    }
  }

  // ── Customer routes: must be authenticated + user role ───────────────────
  if (isCustomerRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (role && role !== ERole.USER) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/email-verification/:path*',
    '/admin/:path*',
    '/customer/:path*',
  ],
};
