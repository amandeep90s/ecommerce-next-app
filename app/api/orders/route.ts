import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const orders = await Order.find({ userId: auth.user.id }).sort({ createdAt: -1 }).lean();

    return successResponse({
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch orders',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
