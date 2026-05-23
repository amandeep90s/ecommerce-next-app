import mongoose from 'mongoose';

import { IProductItem } from './product.types';
import { IUserAvatar } from './user.types';

// Serialized user shape as returned by populate('user', 'name email avatar')
export interface IReviewUser {
  id: string;
  name: string;
  email: string;
  avatar?: IUserAvatar;
}

export interface IReview {
  id: string;
  product: string | IProductItem;
  user: string | IReviewUser;
  rating: number;
  title: string;
  comment: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized review item as returned from the API (JSON-safe)
export interface IReviewItem {
  id: string;
  product: IProductItem;
  user: IReviewUser;
  rating: number;
  title: string;
  comment: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReviewPayload {
  product: string;
  user: string;
  rating: number;
  title: string;
  comment: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ICreateReviewResponse {
  message: string;
  data?: IReviewItem;
}

export interface IUpdateReviewResponse {
  message: string;
  data?: IReviewItem;
}

export interface IGetReviewByIdResponse {
  message: string;
  data: IReviewItem | null;
}

export interface IReviewPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetReviewsResponse {
  message: string;
  data: {
    items: IReviewItem[];
    meta: IReviewPaginationMeta;
  } | null;
}

export interface IReviewDocument extends IReview, mongoose.Document {}
