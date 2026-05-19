import { StatusCodes } from 'http-status-codes';

import cloudinary from '@/config/cloudinary';
import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Media from '@/models/media.model';

export async function DELETE(request: Request) {
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

    // Fetch public_ids before deleting so we can remove from Cloudinary
    const mediaItems = await Media.find({ _id: { $in: body.ids } }).select('public_id');
    const publicIds = mediaItems.map((item) => item.public_id);

    // Delete from Cloudinary
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    // Hard delete from MongoDB
    const result = await Media.deleteMany({ _id: { $in: body.ids } });

    return successResponse({
      message: `${result.deletedCount} media file(s) permanently deleted`,
      data: { deletedCount: result.deletedCount },
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to permanently delete media',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
