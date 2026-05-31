import { StatusCodes } from 'http-status-codes';

import { connectToDatabase } from '@/config/database';
import { ERole } from '@/enums';
import { errorResponse, successResponse } from '@/lib/api-response';
import { requireAuth } from '@/lib/require-auth';
import Notification from '@/models/notification.model';

// ─── GET /api/admin/notifications — Fetch notifications ──────────────────────

export async function GET(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .then((docs) =>
        docs.map((doc) => ({
          id: doc.id.toString(),
          type: doc.type,
          title: doc.title,
          message: doc.message,
          referenceId: doc.referenceId,
          isRead: doc.isRead,
          createdAt: doc.createdAt,
        })),
      );

    const unreadCount = await Notification.countDocuments({ isRead: false });

    return successResponse({
      message: 'Notifications fetched successfully',
      data: { notifications, unreadCount },
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to fetch notifications',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

// ─── PATCH /api/admin/notifications — Mark notifications as read ─────────────

export async function PATCH(request: Request) {
  const auth = await requireAuth(ERole.ADMIN);
  if (auth.response) return auth.response;

  try {
    await connectToDatabase();

    const { ids } = await request.json();

    if (ids === 'all') {
      await Notification.updateMany({ isRead: false }, { isRead: true });
    } else if (Array.isArray(ids) && ids.length > 0) {
      await Notification.updateMany({ _id: { $in: ids } }, { isRead: true });
    }

    return successResponse({
      message: 'Notifications marked as read',
    });
  } catch (error) {
    return errorResponse({
      message: 'Failed to update notifications',
      errors: error,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
