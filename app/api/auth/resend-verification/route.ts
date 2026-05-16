import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import { type NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { APP_BASE_URL, SECRET_KEY } from '@/config/env';
import { emailVerificationLink } from '@/email/emailVerificationLink';
import { errorResponse, successResponse } from '@/lib/api-response';
import { sendEmail } from '@/lib/send-email';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email } = await request.json();

    if (!email) {
      return errorResponse({
        message: 'Email is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse({
        message: 'No account found with this email address',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (user.is_email_verified) {
      return errorResponse({
        message: 'This email address is already verified',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({ userId: user.id.toString() })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    await sendEmail({
      subject: 'Email Verification request from E-commerce Next.js App',
      to: user.email,
      html: emailVerificationLink(`${APP_BASE_URL}/email-verification/${token}`),
    });

    return successResponse({
      message: 'Verification email sent. Please check your inbox.',
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
