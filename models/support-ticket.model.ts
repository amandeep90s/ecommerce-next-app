import mongoose from 'mongoose';

export type TicketCategory = 'order' | 'product' | 'shipping' | 'billing' | 'account' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    orderId: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      enum: [
        'order',
        'product',
        'shipping',
        'billing',
        'account',
        'other',
      ] satisfies TicketCategory[],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'] satisfies TicketPriority[],
      default: 'medium',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'] satisfies TicketStatus[],
      default: 'open',
    },
    adminNotes: {
      type: String,
      trim: true,
      default: null,
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

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model('SupportTicket', supportTicketSchema, 'support_tickets');

export default SupportTicket;
