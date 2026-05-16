import mongoose from 'mongoose';

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
  },
);

otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema, 'otps');

export default OTP;
