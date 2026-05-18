import mongoose from 'mongoose';

import { IMediaDocument } from '@/types';

const mediaSchema = new mongoose.Schema(
  {
    asset_id: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

const Media = (mongoose.models.Media ||
  mongoose.model<IMediaDocument>('Media', mediaSchema, 'medias')) as mongoose.Model<IMediaDocument>;

export default Media;
