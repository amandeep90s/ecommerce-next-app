import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Newsletter =
  mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema, 'newsletters');

export default Newsletter;
