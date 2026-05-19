import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { uploadMediaSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Media from '@/models/media.model';

export async function POST(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate that files array exists
    if (!Array.isArray(body.files) || body.files.length === 0) {
      return errorResponse({
        message: 'No files provided',
        errors: { files: 'At least one file is required' },
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    // Validate each file in the batch
    const validatedFiles = [];
    const validationErrors: Record<number, unknown> = {};

    for (let i = 0; i < body.files.length; i++) {
      const validatedData = uploadMediaSchema.safeParse(body.files[i]);

      if (!validatedData.success) {
        validationErrors[i] = validatedData.error;
      } else {
        validatedFiles.push(validatedData.data);
      }
    }

    // If there are any validation errors, return them
    if (Object.keys(validationErrors).length > 0) {
      return errorResponse({
        message: 'Validation failed for one or more files',
        errors: validationErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    // Batch insert all files
    const insertedMedia = await Media.insertMany(validatedFiles);

    return successResponse({
      message: `${insertedMedia.length} media file(s) uploaded successfully`,
      data: insertedMedia,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to save media files',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
