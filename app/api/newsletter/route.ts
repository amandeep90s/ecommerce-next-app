import crypto from 'node:crypto';

import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Newsletter from '@/models/newsletter.model';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ─── GET /api/newsletter — Admin: list all subscribers ────────────────────────

export async function GET(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const q = searchParams.get('q')?.trim() || '';

    const baseQuery: Record<string, unknown> = {};

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.email = { $regex: escaped, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Newsletter.find(baseQuery)
        .sort({ subscribedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Newsletter.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Newsletter subscribers fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch newsletter subscribers',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── POST /api/newsletter — Public: subscribe ─────────────────────────────────

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation error',
        errors: z.flattenError(parsed.error).fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    const { email } = parsed.data;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return errorResponse({
        message: 'This email is already subscribed.',
        statusCode: StatusCodes.CONFLICT,
      });
    }

    const unsubscribeToken = crypto.randomUUID();
    const subscriber = await Newsletter.create({ email, unsubscribeToken });

    return successResponse({
      message: 'Successfully subscribed to our newsletter!',
      data: subscriber,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to subscribe',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
