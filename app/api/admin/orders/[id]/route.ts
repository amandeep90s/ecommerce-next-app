import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return errorResponse({ message: 'Order not found', statusCode: StatusCodes.NOT_FOUND });
    }

    return successResponse({ message: 'Order fetched successfully', data: order });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch order',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return errorResponse({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!order) {
      return errorResponse({ message: 'Order not found', statusCode: StatusCodes.NOT_FOUND });
    }

    return successResponse({ message: 'Order status updated', data: order });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update order',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
