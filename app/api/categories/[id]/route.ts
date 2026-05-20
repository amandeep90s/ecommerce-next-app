import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { updateCategorySchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Category from '@/models/category.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const category = await Category.findById(id);

    if (!category) {
      return errorResponse({
        message: 'Category not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Category fetched successfully',
      data: category,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch category',
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
    const parsed = updateCategorySchema.safeParse(body);

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
      _id: { $ne: id },
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

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { returnDocument: 'after', runValidators: true },
    );

    if (!category) {
      return errorResponse({
        message: 'Category not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Category updated successfully',
      data: category,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update category',
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
    const category = await Category.findByIdAndUpdate(
      id,
      { deleteAt: new Date() },
      { returnDocument: 'after' },
    );

    if (!category) {
      return errorResponse({
        message: 'Category not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Category moved to trash',
      data: category,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete category',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
