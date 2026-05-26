import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Newsletter from '@/models/newsletter.model';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ─── DELETE /api/newsletter/:id — Admin: remove a subscriber ─────────────────

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { id } = await params;
    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return errorResponse({
        message: 'Subscriber not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Subscriber removed successfully',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to remove subscriber',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
