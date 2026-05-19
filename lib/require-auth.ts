import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { SECRET_KEY } from '@/config/env';
import { ERole } from '@/enums';
import { errorResponse } from '@/lib/api-response';
import { IAuthUser } from '@/types';

type AuthSuccess = { user: IAuthUser; response: null };
type AuthFailure = { user: null; response: ReturnType<typeof errorResponse> };
type AuthResult = AuthSuccess | AuthFailure;

/**
 * Verifies the access_token cookie and optionally checks the user's role.
 *
 * Usage in API route handlers:
 *   const auth = await requireAuth();           // any authenticated user
 *   const auth = await requireAuth(ERole.ADMIN); // admin only
 *   if (auth.response) return auth.response;
 *   const user = auth.user; // IAuthUser
 */
export async function requireAuth(requiredRole?: ERole): Promise<AuthResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return {
      user: null,
      response: errorResponse({
        message: 'Unauthorized. Please sign in.',
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    };
  }

  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(accessToken, secret);

    const user: IAuthUser = {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as IAuthUser['role'],
      avatar: payload.avatar as IAuthUser['avatar'],
      phone: payload.phone as string | undefined,
    };

    if (requiredRole && user.role !== requiredRole) {
      return {
        user: null,
        response: errorResponse({
          message: 'Forbidden. You do not have permission to access this resource.',
          statusCode: StatusCodes.FORBIDDEN,
        }),
      };
    }

    return { user, response: null };
  } catch {
    return {
      user: null,
      response: errorResponse({
        message: 'Unauthorized. Invalid or expired token.',
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    };
  }
}
