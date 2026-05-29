import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import SupportTicket from '@/models/support-ticket.model';

/**
 * Generates a collision-resistant ticket ID using the current timestamp (base36)
 * plus 4 random alphanumeric chars to handle sub-millisecond concurrency.
 * Example: "LNQ8KV4SA3B2" — no external dependencies, no DB round-trip.
 */
function generateTicketId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${ts}${rand}`;
}

const createTicketSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.email('Please enter a valid email address').trim().max(100),
  orderId: z.string().trim().max(100).optional(),
  category: z.enum(['order', 'product', 'shipping', 'billing', 'account', 'other']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
});

// ─── POST /api/support-tickets — Public: submit a support ticket ─────────────

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createTicketSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    await connectToDatabase();

    const ticketNumber = generateTicketId();

    const ticket = await SupportTicket.create({ ...parsed.data, ticketNumber });

    return successResponse({
      message: `Your support ticket has been submitted. Your ticket number is ${ticket.ticketNumber}. We will get back to you soon.`,
      data: ticket,
      statusCode: StatusCodes.CREATED,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to submit support ticket',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── GET /api/support-tickets — Admin: list all tickets ──────────────────────

export async function GET(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const q = searchParams.get('q')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const priority = searchParams.get('priority')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';

    const baseQuery: Record<string, unknown> = {};

    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      baseQuery.$or = [
        { ticketNumber: { $regex: escaped, $options: 'i' } },
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { subject: { $regex: escaped, $options: 'i' } },
      ];
    }

    if (status && ['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      baseQuery.status = status;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      baseQuery.priority = priority;
    }

    if (
      category &&
      ['order', 'product', 'shipping', 'billing', 'account', 'other'].includes(category)
    ) {
      baseQuery.category = category;
    }

    const [items, total] = await Promise.all([
      SupportTicket.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      SupportTicket.countDocuments(baseQuery),
    ]);

    return successResponse({
      message: 'Support tickets fetched successfully',
      data: {
        items,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch support tickets',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
