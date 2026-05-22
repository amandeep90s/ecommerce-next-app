import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { updateCouponSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Coupon from '@/models/coupon.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return errorResponse({
        message: 'Coupon not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Coupon fetched successfully',
      data: coupon,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch coupon',
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
    const parsed = updateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    // Check code uniqueness if being updated
    if (parsed.data.code) {
      const existing = await Coupon.findOne({
        _id: { $ne: id },
        code: {
          $regex: new RegExp(`^${parsed.data.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        },
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
    }

    const coupon = await Coupon.findByIdAndUpdate(id, parsed.data, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!coupon) {
      return errorResponse({
        message: 'Coupon not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Coupon updated successfully',
      data: coupon,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { returnDocument: 'after' },
    );

    if (!coupon) {
      return errorResponse({
        message: 'Coupon not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Coupon moved to trash',
      data: coupon,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete coupon',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
