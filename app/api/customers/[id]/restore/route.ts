import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import User from '@/models/user.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const customer = await User.findOneAndUpdate(
      { _id: id, role: ERole.USER },
      { deletedAt: null },
      { returnDocument: 'after' },
    ).select('-password -refresh_token -__v');

    if (!customer) {
      return errorResponse({
        message: 'Customer not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Customer restored successfully',
      data: customer,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to restore customer',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
