import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { updateProductSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Product from '@/models/product.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const product = await Product.findById(id).populate('category').populate('media');

    if (!product) {
      return errorResponse({
        message: 'Product not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product fetched successfully',
      data: product,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch product',
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
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    // Auto-generate slug if name is being updated
    if (parsed.data.name) {
      updateData.slug = slugify(parsed.data.name, { replacement: '-', lower: true, strict: true });
    }

    // Check for uniqueness of slug and sku
    const orConditions: Record<string, unknown>[] = [];
    if (updateData.slug) {
      orConditions.push({ slug: updateData.slug });
    }
    if (parsed.data.sku) {
      orConditions.push({
        sku: {
          $regex: new RegExp(`^${parsed.data.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        },
      });
    }

    if (orConditions.length > 0) {
      const existing = await Product.findOne({
        _id: { $ne: id },
        $or: orConditions,
      });

      if (existing) {
        const errors: Record<string, string[]> = {};
        if (updateData.slug && existing.slug === updateData.slug) {
          errors.name = ['A product with this name already exists'];
        }
        if (parsed.data.sku && existing.sku.toLowerCase() === parsed.data.sku.toLowerCase()) {
          errors.sku = ['A product with this SKU already exists'];
        }
        return NextResponse.json(
          { success: false, message: 'Validation error', errors },
          { status: StatusCodes.UNPROCESSABLE_ENTITY },
        );
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('category')
      .populate('media');

    if (!product) {
      return errorResponse({
        message: 'Product not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product updated successfully',
      data: product,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update product',
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
    const product = await Product.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { returnDocument: 'after' },
    );

    if (!product) {
      return errorResponse({
        message: 'Product not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product moved to trash',
      data: product,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete product',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
