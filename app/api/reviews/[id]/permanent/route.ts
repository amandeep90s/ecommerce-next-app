import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Review from '@/models/review.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return errorResponse({
        message: 'Review not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Review permanently deleted',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to permanently delete review',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
