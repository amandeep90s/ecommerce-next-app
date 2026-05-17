import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

import { SECRET_KEY } from '@/config/env';
import { errorResponse, successResponse } from '@/lib/api-response';
import { IAuthUser } from '@/types';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return errorResponse({
        message: 'Not authenticated',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

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

    return successResponse({ message: 'Authenticated', data: user });
  } catch {
    // Token expired or invalid — caller should attempt a refresh
    return errorResponse({
      message: 'Token expired or invalid',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
}
