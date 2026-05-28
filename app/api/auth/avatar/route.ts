import { StatusCodes } from 'http-status-codes';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { z } from 'zod';

import cloudinary from '@/config/cloudinary';
import { connectToDatabase } from '@/config/database';
import { SECRET_KEY } from '@/config/env';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import User from '@/models/user.model';
import type { IAuthUser } from '@/types';

const updateAvatarSchema = z.object({
  url: z.url({ message: 'Invalid URL' }),
  public_id: z.string().min(1, { message: 'public_id is required' }),
});

async function reissueToken(updatedUser: IAuthUser) {
  const secret = new TextEncoder().encode(SECRET_KEY);
  const token = await new SignJWT(updatedUser as unknown as Record<string, unknown>)
    .setIssuedAt()
    .setExpirationTime('15m')
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedData = updateAvatarSchema.safeParse(body);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { url, public_id } = validatedData.data;

    const user = await User.findOne({ _id: auth.user.id, deletedAt: null });

    if (!user) {
      return errorResponse({ message: 'User not found', statusCode: StatusCodes.NOT_FOUND });
    }

    // Remove the old avatar from Cloudinary if it exists
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = { url, public_id };
    await user.save();

    const updatedUser: IAuthUser = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    };

    await reissueToken(updatedUser);

    return successResponse({
      message: 'Avatar updated successfully',
      data: updatedUser,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update avatar',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: auth.user.id, deletedAt: null });

    if (!user) {
      return errorResponse({ message: 'User not found', statusCode: StatusCodes.NOT_FOUND });
    }

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = undefined;
    await user.save();

    const updatedUser: IAuthUser = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: undefined,
      phone: user.phone,
    };

    await reissueToken(updatedUser);

    return successResponse({
      message: 'Avatar removed successfully',
      data: updatedUser,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to remove avatar',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
