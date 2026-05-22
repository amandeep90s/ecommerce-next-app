import mongoose from 'mongoose';

import { EProductVariantSize } from '@/enums';
import { IProductVariantDocument } from '@/types';

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      enum: Object.values(EProductVariantSize),
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
    discount: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
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

productVariantSchema.index({ deletedAt: 1, product: 1 });

const ProductVariant = (mongoose.models.ProductVariant ||
  mongoose.model<IProductVariantDocument>(
    'ProductVariant',
    productVariantSchema,
    'product_variants',
  )) as mongoose.Model<IProductVariantDocument>;

export default ProductVariant;
