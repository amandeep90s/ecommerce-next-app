import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Product from '@/models/product.model';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    const items = await Product.find({ isTrending: true, isActive: true, deletedAt: null })
      .populate('category')
      .populate('media')
      .sort({ createdAt: -1 })
      .limit(limit);

    return successResponse({
      message: 'Trending products fetched successfully',
      data: items,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch trending products',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
