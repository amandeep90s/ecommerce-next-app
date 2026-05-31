import { StatusCodes } from 'http-status-codes';
import { type NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import ProductVariant from '@/models/product-variant.model';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const productId = request.nextUrl.searchParams.get('product');

    if (!productId) {
      return errorResponse({
        message: 'Product ID is required',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const variants = await ProductVariant.find({
      product: productId,
      isActive: true,
      deletedAt: null,
    })
      .populate('media')
      .sort({ createdAt: -1 });

    return successResponse({
      message: 'Product variants fetched successfully',
      data: variants,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch product variants',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
