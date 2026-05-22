import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { returnDocument: 'after' },
    );

    if (!coupon) {
      return errorResponse({
        message: 'Coupon not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Coupon restored successfully',
      data: coupon,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to restore coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
