import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;

    const order = await Order.findOne({ _id: id, userId: auth.user.id });

    if (!order) {
      return errorResponse({
        message: 'Order not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch order',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
