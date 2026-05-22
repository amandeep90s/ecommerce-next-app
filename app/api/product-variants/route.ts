import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { createProductVariantSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import ProductVariant from '@/models/product-variant.model';

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
    const productId = searchParams.get('product') || '';

    const baseQuery: Record<string, unknown> = {
      deletedAt: filter === 'trashed' ? { $ne: null } : null,
    };

    if (productId) {
      baseQuery.product = productId;
    }

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.$or = [
        { color: { $regex: escaped, $options: 'i' } },
        { sku: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      ProductVariant.find(baseQuery)
        .populate('product')
        .populate('media')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ProductVariant.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Product variants fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch product variants',
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
    const parsed = createProductVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { sku, ...rest } = parsed.data;

    const existing = await ProductVariant.findOne({
      sku: { $regex: new RegExp(`^${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
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

    const variant = await ProductVariant.create({ sku, ...rest });
    const populated = await ProductVariant.findById(variant._id)
      .populate('product')
      .populate('media');

    return successResponse({
      message: 'Product variant created successfully',
      data: populated,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create product variant',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
