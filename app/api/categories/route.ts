import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { createCategorySchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Category from '@/models/category.model';

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
      deleteAt: filter === 'trashed' ? { $ne: null } : null,
    };

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Category.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Category.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Categories fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch categories',
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
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { name } = parsed.data;
    const slug = slugify(name, { replacement: '-', lower: true, strict: true });

    const existing = await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { slug },
      ],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: { name: ['A category with this name already exists'] },
        },
        { status: StatusCodes.UNPROCESSABLE_ENTITY },
      );
    }

    const category = await Category.create({ name, slug });

    return successResponse({
      message: 'Category created successfully',
      data: category,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create category',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
