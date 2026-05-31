import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Coupon from '@/models/coupon.model';

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();

    const coupons = await Coupon.find({
      deletedAt: null,
      isActive: true,
      validFrom: { $lte: now },
      validTo: { $gte: now },
    } as Record<string, unknown>)
      .select('code discount minimumPurchase validTo')
      .sort({ discount: -1 })
      .limit(10)
      .lean();

    return successResponse({
      message: 'Active coupons fetched successfully',
      data: coupons,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch active coupons',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
