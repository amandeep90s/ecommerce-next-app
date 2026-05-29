import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Contact from '@/models/contact.model';

const updateStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied']),
});

// ─── PATCH /api/contact/[id] — Admin: update status ──────────────────────────

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }

    await connectToDatabase();

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    );

    if (!contact) {
      return errorResponse({
        message: 'Contact submission not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Status updated successfully',
      data: contact,
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update status',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── DELETE /api/contact/[id] — Admin: delete submission ─────────────────────

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    const { id } = await params;

    await connectToDatabase();

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return errorResponse({
        message: 'Contact submission not found',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    return successResponse({
      message: 'Contact submission deleted successfully',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to delete contact submission',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
