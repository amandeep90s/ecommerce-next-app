import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return errorResponse({
        message: 'Coupon not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Coupon permanently deleted',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to permanently delete coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
