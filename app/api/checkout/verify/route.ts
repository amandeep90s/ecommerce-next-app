import { StatusCodes } from 'http-status-codes';
import { type NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { stripe } from '@/config/stripe';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return errorResponse({
        message: 'Session ID is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.orderId) {
      return errorResponse({
        message: 'Invalid session',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    await connectToDatabase();

    const order = await Order.findOne({
      _id: session.metadata.orderId,
      userId: auth.user.id,
    });

    if (!order) {
      return errorResponse({
        message: 'Order not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Payment verified successfully',
      data: {
        order,
        paymentStatus: session.payment_status,
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to verify payment',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
