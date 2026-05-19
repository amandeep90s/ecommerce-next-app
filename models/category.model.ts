import mongoose from 'mongoose';

import { ICategoryDocument } from '@/types';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    deleteAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

const Category = (mongoose.models.Category ||
  mongoose.model<ICategoryDocument>(
    'Category',
    categorySchema,
    'categories',
  )) as mongoose.Model<ICategoryDocument>;

export default Category;
