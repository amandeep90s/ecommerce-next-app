import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { createProductSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Product from '@/models/product.model';

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
      baseQuery.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
        { sku: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(baseQuery)
        .populate('category')
        .populate('media')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Products fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch products',
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
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { name, sku, ...rest } = parsed.data;
    const slug = slugify(name, { replacement: '-', lower: true, strict: true });

    const existing = await Product.findOne({
      $or: [
        { slug },
        { sku: { $regex: new RegExp(`^${sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
      ],
    });

    if (existing) {
      const errors: Record<string, string[]> = {};
      if (existing.slug === slug) {
        errors.name = ['A product with this name already exists'];
      }
      if (existing.sku.toLowerCase() === sku.toLowerCase()) {
        errors.sku = ['A product with this SKU already exists'];
      }
      return NextResponse.json(
        { success: false, message: 'Validation error', errors },
        { status: StatusCodes.UNPROCESSABLE_ENTITY },
      );
    }

    const product = await Product.create({ name, slug, sku, ...rest });
    const populated = await Product.findById(product._id).populate('category').populate('media');

    return successResponse({
      message: 'Product created successfully',
      data: populated,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create product',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
