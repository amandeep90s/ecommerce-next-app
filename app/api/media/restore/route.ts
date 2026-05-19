import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Media from '@/models/media.model';

export async function PATCH(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();

    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return errorResponse({
        message: 'No IDs provided',
        errors: { ids: 'At least one ID is required' },
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const result = await Media.updateMany({ _id: { $in: body.ids } }, { deletedAt: null });

    return successResponse({
      message: `${result.modifiedCount} media file(s) restored successfully`,
      data: { restoredCount: result.modifiedCount },
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to restore media',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
