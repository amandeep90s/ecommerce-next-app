import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Product from '@/models/product.model';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    const product = await Product.findOne({ slug, isActive: true, deletedAt: null })
      .populate('category')
      .populate('media');

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
