import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Review from '@/models/review.model';

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
