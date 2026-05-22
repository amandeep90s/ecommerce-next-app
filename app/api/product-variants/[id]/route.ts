import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { updateProductVariantSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import ProductVariant from '@/models/product-variant.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const variant = await ProductVariant.findById(id).populate('product').populate('media');

    if (!variant) {
      return errorResponse({
        message: 'Product variant not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product variant fetched successfully',
      data: variant,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch product variant',
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
    const parsed = updateProductVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    // Check SKU uniqueness if being updated
    if (parsed.data.sku) {
      const existing = await ProductVariant.findOne({
        _id: { $ne: id },
        sku: {
          $regex: new RegExp(`^${parsed.data.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        },
      });

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation error',
            errors: { sku: ['A variant with this SKU already exists'] },
          },
          { status: StatusCodes.UNPROCESSABLE_ENTITY },
        );
      }
    }

    const variant = await ProductVariant.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('product')
      .populate('media');

    if (!variant) {
      return errorResponse({
        message: 'Product variant not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product variant updated successfully',
      data: variant,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update product variant',
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
    const variant = await ProductVariant.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { returnDocument: 'after' },
    );

    if (!variant) {
      return errorResponse({
        message: 'Product variant not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product variant moved to trash',
      data: variant,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete product variant',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
