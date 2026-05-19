import { StatusCodes } from 'http-status-codes';
import type { NextRequest } from 'next/server';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { uploadMediaSchema } from '@/features/admin/validator';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Media from '@/models/media.model';

const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const filter = searchParams.get('filter') ?? 'active';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10)),
    );

    const query = filter === 'trashed' ? { deletedAt: { $ne: null } } : { deletedAt: null };

    const [total, items] = await Promise.all([
      Media.countDocuments(query),
      Media.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return successResponse({
      message: 'Media fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch media',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const body = await request.json();

    const validatedData = uploadMediaSchema.safeParse(body);

    if (!validatedData.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: validatedData.error,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { asset_id, public_id, path, thumbnail_url, alt } = validatedData.data;

    const media = await Media.create({ asset_id, public_id, path, thumbnail_url, alt });

    return successResponse({
      message: 'Media uploaded successfully',
      data: media,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to save media',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
