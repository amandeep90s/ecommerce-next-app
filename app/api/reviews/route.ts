import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { createReviewSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Review from '@/models/review.model';

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
        { title: { $regex: escaped, $options: 'i' } },
        { comment: { $regex: escaped, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Review.find(baseQuery)
        .populate('product', 'name slug')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Reviews fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch reviews',
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
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const existing = await Review.findOne({
      product: parsed.data.product,
      user: parsed.data.user,
    });

    if (existing) {
      return errorResponse({
        message: 'This user has already reviewed this product',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const review = await Review.create(parsed.data);
    const populated = await review.populate([
      { path: 'product', select: 'name slug' },
      { path: 'user', select: 'name email' },
    ]);

    return successResponse({
      message: 'Review created successfully',
      data: populated,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to create review',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
