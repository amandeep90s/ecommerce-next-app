import mongoose from 'mongoose';

import type { IOTPDocument } from '@/types';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    expires_at: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
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

otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const OTP = (mongoose.models.OTP ||
  mongoose.model<IOTPDocument>('OTP', otpSchema, 'otps')) as mongoose.Model<IOTPDocument>;

export default OTP;
