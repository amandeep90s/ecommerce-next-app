import { StatusCodes } from 'http-status-codes';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { otpEmail } from '@/email/otpEmail';
import { resendOtpSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { generateOTP } from '@/lib/generate-otp';
import { sendEmail } from '@/lib/send-email';
import OTP from '@/models/otp.model';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = resendOtpSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { email } = validatedData.data;

    const user = await User.findOne({ email, deletedAt: null });

    if (!user) {
      return errorResponse({
        message: 'No account found with this email address.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (!user.is_email_verified) {
      return errorResponse({
        message: 'Email is not verified. Please verify your email first.',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

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
      message: 'A new OTP has been sent to your email address.',
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
