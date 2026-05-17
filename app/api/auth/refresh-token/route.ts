import { StatusCodes } from 'http-status-codes';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { errorResponse, successResponse } from '@/lib/api-response';
import User from '@/models/user.model';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return errorResponse({
        message: 'No refresh token provided',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const secret = new TextEncoder().encode(SECRET_KEY);

    let userId: string;
    try {
      const { payload } = await jwtVerify(refreshToken, secret);
      userId = payload.id as string;
    } catch {
      // Refresh token expired or tampered — force re-login
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      return errorResponse({
        message: 'Refresh token expired. Please sign in again.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    await connectToDatabase();

    const user = await User.findOne({ _id: userId, refresh_token: refreshToken, deletedAt: null });

    if (!user) {
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      return errorResponse({
        message: 'Session invalidated. Please sign in again.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const loggedInUser = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    };

    const newAccessToken = await new SignJWT(loggedInUser)
      .setIssuedAt()
      .setExpirationTime('15m')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const newRefreshToken = await new SignJWT({ id: user.id.toString() })
      .setIssuedAt()
      .setExpirationTime('7d')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    await User.updateOne({ _id: user.id }, { refresh_token: newRefreshToken });

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return successResponse({ message: 'Token refreshed', data: loggedInUser });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
