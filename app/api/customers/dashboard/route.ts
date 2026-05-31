import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';
import Wishlist from '@/models/wishlist.model';

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const [totalOrders, recentOrders, wishlist] = await Promise.all([
      Order.countDocuments({ user: auth.user.id }),
      Order.find({ user: auth.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .then((orders) =>
          orders.map((o) => ({
            id: o._id.toString(),
            orderNumber: o.orderNumber,
            total: o.total,
            status: o.status,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt,
          })),
        ),
      Wishlist.findOne({ userId: auth.user.id }),
    ]);

    const pendingOrders = await Order.countDocuments({
      user: auth.user.id,
      status: { $in: ['pending', 'processing', 'shipped'] },
    });

    return successResponse({
      message: 'Dashboard data fetched successfully',
      data: {
        totalOrders,
        pendingOrders,
        wishlistCount: wishlist?.products?.length ?? 0,
        recentOrders,
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch dashboard data',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
