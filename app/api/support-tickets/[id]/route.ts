import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import SupportTicket from '@/models/support-ticket.model';

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  adminNotes: z.string().max(3000).optional(),
});

// ─── PATCH /api/support-tickets/[id] — Admin: update ticket ──────────────────

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = updateTicketSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    await connectToDatabase();

    const ticket = await SupportTicket.findByIdAndUpdate(id, parsed.data, { new: true });

    if (!ticket) {
      return errorResponse({
        message: 'Support ticket not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Support ticket updated successfully',
      data: ticket,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update support ticket',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── DELETE /api/support-tickets/[id] — Admin: delete ticket ─────────────────

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    await connectToDatabase();

    const ticket = await SupportTicket.findByIdAndDelete(id);

    if (!ticket) {
      return errorResponse({
        message: 'Support ticket not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({ message: 'Support ticket deleted successfully' });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete support ticket',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
