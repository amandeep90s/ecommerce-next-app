import mongoose from 'mongoose';

export type NotificationType = 'new_order' | 'new_support_ticket' | 'new_contact';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['new_order', 'new_support_ticket', 'new_contact'] satisfies NotificationType[],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    referenceId: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema, 'notifications');

export default Notification;
