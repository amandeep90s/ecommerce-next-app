import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import ProductVariant from '@/models/product-variant.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const variant = await ProductVariant.findByIdAndUpdate(
      id,
      { deletedAt: null },
      { returnDocument: 'after' },
    );

    if (!variant) {
      return errorResponse({
        message: 'Product variant not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Product variant restored successfully',
      data: variant,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to restore product variant',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
