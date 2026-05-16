import { StatusCodes } from 'http-status-codes';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { isValidObjectId } from 'mongoose';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { errorResponse, successResponse } from '@/lib/api-response';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { token } = await request.json();

    if (!token) {
      return errorResponse({
        message: 'Token is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const secret = new TextEncoder().encode(SECRET_KEY);

    const decodeToken = await jwtVerify(token, secret);

    const userId = decodeToken.payload.userId;

    if (!isValidObjectId(userId)) {
      return errorResponse({
        message: 'Invalid token',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const isExists = await User.exists({ _id: userId });

    if (!isExists) {
      return errorResponse({
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    await User.updateOne({ _id: userId }, { is_email_verified: true });

    return successResponse({
      message: 'Email verified successfully',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    if (error instanceof JWTExpired) {
      return errorResponse({
        message: 'Verification link has expired. Please request a new one.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    return errorResponse({
      message: 'Invalid or expired token',
      statusCode: StatusCodes.UNAUTHORIZED,
      errors: error,
    });
  }
}
