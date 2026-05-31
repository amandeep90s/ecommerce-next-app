import mongoose from 'mongoose';

import { EOrderStatus, EPaymentMethod, EPaymentStatus } from '@/enums';
import { IOrderDocument } from '@/types';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerSnapshot: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
    },
    couponCode: {
      type: String,
      trim: true,
    },
    products: [
      {
        // Keep the ref for admin population / analytics joins.
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // Snapshot fields — recorded at the moment the order is placed so
        // that changes/deletions to the product/variant never corrupt order data.
        name: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
        },
        selling_price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductVariant',
          default: null,
        },
        color: {
          type: String,
          trim: true,
          default: null,
        },
        size: {
          type: String,
          trim: true,
          default: null,
        },
        sku: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
    // Embedded address snapshot — copying the address at checkout time so
    // that later edits or deletions of the saved address don't affect the record.
    shippingAddress: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address_line1: {
        type: String,
        trim: true,
      },
      address_line2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postal_code: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.PENDING,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      default: EPaymentMethod.STRIPE,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(EPaymentStatus),
      default: EPaymentStatus.PENDING,
    },
    stripeSessionId: {
      type: String,
      trim: true,
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
    },
    stripeCouponId: {
      type: String,
      trim: true,
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

const Order = (mongoose.models.Order ||
  mongoose.model<IOrderDocument>('Order', orderSchema, 'orders')) as mongoose.Model<IOrderDocument>;

export default Order;
