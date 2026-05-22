import mongoose from 'mongoose';

import { IReviewDocument } from '@/types';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ deletedAt: 1, product: 1 });
reviewSchema.index({ deletedAt: 1, user: 1 });

const Review = (mongoose.models.Review ||
  mongoose.model<IReviewDocument>(
    'Review',
    reviewSchema,
    'reviews',
  )) as mongoose.Model<IReviewDocument>;

export default Review;
