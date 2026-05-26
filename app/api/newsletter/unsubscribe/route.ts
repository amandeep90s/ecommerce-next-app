import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { errorResponse, successResponse } from '@/lib/api-response';
import Newsletter from '@/models/newsletter.model';

const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Unsubscribe token is required'),
});

// ─── POST /api/newsletter/unsubscribe — Public: unsubscribe by token ──────────

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = unsubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: z.flattenError(parsed.error).fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { token } = parsed.data;

    const subscriber = await Newsletter.findOneAndDelete({ unsubscribeToken: token });

    if (!subscriber) {
      return errorResponse({
        message: 'Invalid or expired unsubscribe token.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'You have been successfully unsubscribed.',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to unsubscribe',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
