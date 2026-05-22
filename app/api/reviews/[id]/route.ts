import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { updateReviewSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Review from '@/models/review.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const review = await Review.findById(id)
      .populate('product', 'name slug')
      .populate('user', 'name email');

    if (!review) {
      return errorResponse({
        message: 'Review not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Review fetched successfully',
      data: review,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch review',
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
    const parsed = updateReviewSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: parsed.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const review = await Review.findByIdAndUpdate(id, parsed.data, { new: true })
      .populate('product', 'name slug')
      .populate('user', 'name email');

    if (!review) {
      return errorResponse({
        message: 'Review not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update review',
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
    const review = await Review.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { returnDocument: 'after' },
    );

    if (!review) {
      return errorResponse({
        message: 'Review not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Review moved to trash',
      data: review,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete review',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
