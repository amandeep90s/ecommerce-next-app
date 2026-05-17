import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { resetPasswordSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = resetPasswordSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { token, password } = validatedData.data;

    const secret = new TextEncoder().encode(SECRET_KEY);

    let userId: string;
    try {
      const { payload: tokenPayload } = await jwtVerify(token, secret);
      userId = tokenPayload.userId as string;
    } catch {
      return errorResponse({
        message: 'This password reset link is invalid or has expired. Please request a new one.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const user = await User.findOne({ _id: userId, deletedAt: null });

    if (!user) {
      return errorResponse({
        message: 'User not found.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    user.password = password;
    // Rotate refresh token to invalidate all active sessions after a password reset.
    user.refresh_token = undefined;
    await user.save();

    return successResponse({
      message: 'Password reset successful. You can now sign in with your new password.',
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
