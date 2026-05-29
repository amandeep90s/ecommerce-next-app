import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Product from '@/models/product.model';
import Review from '@/models/review.model';

const createReviewSchema = z.object({
  productId: z.string().refine((v) => mongoose.isValidObjectId(v), 'Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  comment: z.string().min(10).max(2000),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '6', 10)));
    const productId = searchParams.get('product') || '';

    const query: Record<string, unknown> = { deletedAt: null };
    if (productId) query.product = productId;

    const items = await Review.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);

    return successResponse({
      message: 'Reviews fetched successfully',
      data: items,
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
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    await connectToDatabase();

    const productExists = await Product.exists({
      _id: parsed.data.productId,
      deletedAt: null,
      isActive: true,
    });

    if (!productExists) {
      return errorResponse({
        message: 'Product not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const existing = await Review.findOne({
      product: parsed.data.productId,
      user: auth.user.id,
    });

    if (existing) {
      return errorResponse({
        message: 'You have already reviewed this product',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const review = await Review.create({
      product: parsed.data.productId,
      user: auth.user.id,
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
    });

    const populated = await review.populate('user', 'name email avatar');

    return successResponse({
      message: 'Review submitted successfully',
      data: populated,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to submit review',
      errors: error,
    });
  }
}
