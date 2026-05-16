import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import { type NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { APP_BASE_URL, SECRET_KEY } from '@/config/env';
import { emailVerificationLink } from '@/email/emailVerificationLink';
import { signUpSchema } from '@/features/auth/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { sendEmail } from '@/lib/send-email';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const validatedData = signUpSchema.safeParse(payload);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { name, email, password } = validatedData.data;

    const isExists = await User.exists({ email });

    if (isExists) {
      return errorResponse({
        message: 'User already exists',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({ userId: newUser.id })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    // Send verification email here
    await sendEmail({
      subject: 'Email Verification request from E-commerce Next.js App',
      to: newUser.email,
      html: emailVerificationLink(`${APP_BASE_URL}/email-verification/${token}`),
    });

    return successResponse({
      message: 'User registered successfully',
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      errors: error,
    });
  }
}
