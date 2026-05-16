import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { otpVerificationSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import OTP from '@/models/otp.model';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = otpVerificationSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { email, otp } = validatedData.data;

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return errorResponse({
        message: 'OTP not found or has expired. Please request a new one.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (new Date() > otpRecord.expires_at) {
      await OTP.deleteOne({ email });
      return errorResponse({
        message: 'OTP has expired. Please request a new one.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (otpRecord.otp !== otp) {
      return errorResponse({
        message: 'Invalid OTP. Please try again.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    await OTP.deleteOne({ email });

    const user = await User.findOne({ email, deletedAt: null });

    if (!user) {
      return errorResponse({
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const secret = new TextEncoder().encode(SECRET_KEY);

    const accessToken = await new SignJWT({
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    })
      .setIssuedAt()
      .setExpirationTime('15m')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const refreshToken = await new SignJWT({ userId: user.id.toString() })
      .setIssuedAt()
      .setExpirationTime('7d')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    await User.updateOne({ _id: user.id }, { refresh_token: refreshToken });

    const cookieStore = await cookies();

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return successResponse({
      message: 'Sign in successful',
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
