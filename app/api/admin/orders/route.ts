import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Order from '@/models/order.model';

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

export async function GET(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const q = searchParams.get('q')?.trim() || '';
    const status = searchParams.get('status') || '';

    const baseQuery: Record<string, unknown> = {};

    if (status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      baseQuery.status = status;
    }

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.$or = [
        { 'customerSnapshot.name': { $regex: escaped, $options: 'i' } },
        { 'customerSnapshot.email': { $regex: escaped, $options: 'i' } },
        { couponCode: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Orders fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch orders',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
