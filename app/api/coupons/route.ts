import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { createCouponSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';

export async function GET(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const q = searchParams.get('q')?.trim() || '';
    const filter = searchParams.get('filter') === 'trashed' ? 'trashed' : 'active';

    const baseQuery: Record<string, unknown> = {
      deletedAt: filter === 'trashed' ? { $ne: null } : null,
    };

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.$or = [{ code: { $regex: escaped, $options: 'i' } }];
    }

    const [items, total] = await Promise.all([
      Coupon.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Coupon.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Coupons fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch coupons',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = createCouponSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { code, ...rest } = parsed.data;

    const existing = await Coupon.findOne({
      code: { $regex: new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: { code: ['A coupon with this code already exists'] },
        },
        { status: StatusCodes.UNPROCESSABLE_ENTITY },
      );
    }

    const coupon = await Coupon.create({ code, ...rest });

    return successResponse({
      message: 'Coupon created successfully',
      data: coupon,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
