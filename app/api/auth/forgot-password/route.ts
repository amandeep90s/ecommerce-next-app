import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { APP_BASE_URL, SECRET_KEY } from '@/config/env';
import { forgotPasswordLink } from '@/email/forgotPasswordLink';
import { forgotPasswordSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { sendEmail } from '@/lib/send-email';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = forgotPasswordSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { email } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null });

    // Return the same message whether the user exists or not to prevent
    // user enumeration attacks.
    if (!user) {
      return successResponse({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    const secret = new TextEncoder().encode(SECRET_KEY);

    const resetToken = await new SignJWT({ userId: user.id.toString() })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    const resetLink = `${APP_BASE_URL}/reset-password?token=${resetToken}`;

    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: forgotPasswordLink(resetLink),
    });

    if (!emailResult.success) {
      return errorResponse({
        message: 'Failed to send password reset email. Please try again later.',
      });
    }

    return successResponse({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
