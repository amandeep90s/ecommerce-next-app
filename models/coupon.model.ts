import mongoose from 'mongoose';

import { ICouponDocument } from '@/types';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    minimumPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

couponSchema.index({ deletedAt: 1, code: 1 });

const Coupon = (mongoose.models.Coupon ||
  mongoose.model<ICouponDocument>(
    'Coupon',
    couponSchema,
    'coupons',
  )) as mongoose.Model<ICouponDocument>;

export default Coupon;
