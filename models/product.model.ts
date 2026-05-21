import mongoose from 'mongoose';

import { IProductDocument } from '@/types';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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
    description: {
      type: String,
      trim: true,
      required: false,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
      },
    ],
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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

productSchema.index({ deletedAt: 1, category: 1 });

const Product = (mongoose.models.Product ||
  mongoose.model<IProductDocument>(
    'Product',
    productSchema,
    'products',
  )) as mongoose.Model<IProductDocument>;

export default Product;
