import { connectToDatabase } from '@/config/database';
import Notification, { type NotificationType } from '@/models/notification.model';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    await connectToDatabase();
    await Notification.create(params);
  } catch {
    // Non-fatal — swallow so it never breaks the main flow
  }
}
