import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { changePasswordSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
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

    const validatedData = changePasswordSchema.safeParse(body);
    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { currentPassword, newPassword } = validatedData.data;

    await connectToDatabase();

    const user = await User.findOne({ _id: userId, deleteAt: null }).select('+password');

    if (!user) {
      return errorResponse({
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return errorResponse({
        message: 'Validation failed',
        errors: { currentPassword: ['Current password is incorrect'] },
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    user.password = newPassword;
    await user.save();

    return successResponse({ message: 'Password changed successfully' });
  } catch (error) {
    return errorResponse({ message: 'Internal server error', errors: error });
  }
}
