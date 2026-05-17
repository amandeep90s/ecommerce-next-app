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

  if (accessToken) {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    try {
      const { payload } = await jwtVerify(accessToken, secret);
      return { isAuthenticated: true, payload: payload as TokenPayload };
    } catch (err) {
      const isExpired = err instanceof Error && err.name === 'JWTExpired';
      if (isExpired && refreshToken) {
        // Decode the expired token to retain the role. The refresh_token's
        // presence is treated as proof the session is still recoverable — the
        // client AuthInitializer will silently issue a new access_token.
        const decoded = decodeJwt(accessToken) as TokenPayload;
        return { isAuthenticated: true, payload: decoded };
      }
    }
  }

  // Has refresh_token but no (valid) access_token and we couldn't decode role.
  if (refreshToken) {
    return { isAuthenticated: true, payload: null };
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
