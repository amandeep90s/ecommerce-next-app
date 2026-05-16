import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { APP_BASE_URL, SECRET_KEY } from '@/config/env';
import { emailVerificationLink } from '@/email/emailVerificationLink';
import { otpEmail } from '@/email/otpEmail';
import { signInSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { generateOTP } from '@/lib/generate-otp';
import { sendEmail } from '@/lib/send-email';
import OTP from '@/models/otp.model';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = signInSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null }).select('+password');

    if (!user) {
      return errorResponse({
        message: 'Invalid email or password',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (!user.is_email_verified) {
      const secret = new TextEncoder().encode(SECRET_KEY);
      const token = await new SignJWT({ userId: user.id.toString() })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);

      // Send verification email here
      await sendEmail({
        subject: 'Email Verification request from E-commerce Next.js App',
        to: user.email,
        html: emailVerificationLink(`${APP_BASE_URL}/email-verification/${token}`),
      });

      return errorResponse({
        message: 'Email not verified. A new verification email has been sent to your inbox.',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse({
        message: 'Invalid email or password',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    // OTP generation and sending logic can be implemented here
    // Delete any existing OTPs for the user
    await OTP.deleteMany({ email });

    const otp = generateOTP();

    await OTP.create({ email, otp });

    const emailResult = await sendEmail({
      to: email,
      subject: 'Your OTP for Sign In',
      html: otpEmail(otp),
    });

    if (!emailResult.success) {
      return errorResponse({
        message: 'Failed to send OTP email. Please try again later.',
      });
    }

    return successResponse({
      message: 'OTP sent to your email address. Please check your inbox.',
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
