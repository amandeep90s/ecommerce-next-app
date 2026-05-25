import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Category from '@/models/category.model';

export async function GET() {
  try {
    await connectToDatabase();

    const items = await Category.find({ deleteAt: null }).sort({ name: 1 }).populate('image');

    return successResponse({
      message: 'Categories fetched successfully',
      data: items,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch categories',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
