import mongoose from 'mongoose';

import { IMediaItem } from './media.types';

export interface ICategory {
  id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string | null;
  image: mongoose.Types.ObjectId | IMediaItem | null;
  deleteAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized category item as returned from the API (JSON-safe)
export interface ICategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: IMediaItem | null;
  deleteAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategoryPayload {
  name: string;
  description?: string | null;
  image?: string | null;
}

export interface ICreateCategoryResponse {
  message: string;
  data?: ICategoryItem;
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string | null;
  image?: string | null;
}

export interface IUpdateCategoryResponse {
  message: string;
  data?: ICategoryItem;
}

export interface IGetCategoryByIdResponse {
  message: string;
  data: ICategoryItem | null;
}

export interface ICategoryPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetCategoriesResponse {
  message: string;
  data: {
    items: ICategoryItem[];
    meta: ICategoryPaginationMeta;
  } | null;
}

export interface ICategoryDocument extends ICategory, mongoose.Document {}
