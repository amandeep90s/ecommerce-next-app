import { StatusCodes } from 'http-status-codes';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { updateProfileSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { ValidationError } from '@/lib/form-error';
import User from '@/models/user.model';

export async function PATCH(request: NextRequest) {
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

    let userId: string;
    try {
      const { payload } = await jwtVerify(accessToken, secret);
      userId = payload.id as string;
    } catch {
      return errorResponse({
        message: 'Token expired or invalid',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const body = await request.json();

    const validatedData = updateProfileSchema.safeParse(body);
    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { name, phone } = validatedData.data;

    await connectToDatabase();

    const user = await User.findOne({ _id: userId, deletedAt: null });

    if (!user) {
      return errorResponse({
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    user.name = name;
    user.phone = phone ?? undefined;
    await user.save();

    const updatedUser = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    };

    // Re-issue access token so navbar reflects the new name/phone immediately
    const newAccessToken = await new SignJWT(updatedUser)
      .setIssuedAt()
      .setExpirationTime('15m')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    return successResponse({ message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse({
        message: error.message,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    return errorResponse({ message: 'Internal server error', errors: error });
  }
}
