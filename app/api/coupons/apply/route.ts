import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { code } = await request.json();

    if (!code) {
      return errorResponse({
        message: 'Coupon code is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const coupon = await Coupon.findOne({
      code: { $regex: new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      deletedAt: null,
      isActive: true,
    });

    if (!coupon) {
      return errorResponse({
        message: 'Invalid coupon code',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const now = new Date();

    if (now < new Date(coupon.validFrom)) {
      return errorResponse({
        message: 'This coupon is not yet active',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (now > new Date(coupon.validTo)) {
      return errorResponse({
        message: 'This coupon has expired',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    return successResponse({
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        discount: coupon.discount,
        minimumPurchase: coupon.minimumPurchase,
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to validate coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
