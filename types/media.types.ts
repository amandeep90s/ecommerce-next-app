import mongoose from 'mongoose';

export interface IMedia {
  id: mongoose.Types.ObjectId;
  asset_id: string;
  public_id: string;
  path: string;
  thumbnail_url: string;
  alt?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUploadMediaPayload {
  asset_id: string;
  public_id: string;
  path: string;
  thumbnail_url: string;
  alt?: string;
}

export interface IUploadMediaBatchPayload {
  files: IUploadMediaPayload[];
}

export interface IUploadMediaResponse {
  message: string;
  data?: unknown;
}

export interface IMediaDocument extends IMedia, mongoose.Document {}
