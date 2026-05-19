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

// Serialized media item as returned from the API (JSON-safe)
export interface IMediaItem {
  id: string;
  asset_id: string;
  public_id: string;
  path: string;
  thumbnail_url: string;
  alt?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface IGetMediaResponse {
  message: string;
  data: IMediaItem[] | null;
}

export interface IBulkDeleteMediaPayload {
  ids: string[];
}

export interface IBulkDeleteMediaResponse {
  message: string;
  data?: unknown;
}

export interface IMediaDocument extends IMedia, mongoose.Document {}
