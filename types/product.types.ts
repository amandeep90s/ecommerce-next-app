import mongoose from 'mongoose';

import { ICategoryItem } from './category.types';
import { IMediaItem } from './media.types';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string | ICategoryItem;
  price: number;
  selling_price: number;
  discount: number;
  description?: string;
  media: (string | IMediaItem)[];
  sku: string;
  stock: number;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized product item as returned from the API (JSON-safe)
export interface IProductItem {
  id: string;
  name: string;
  slug: string;
  category: ICategoryItem;
  price: number;
  selling_price: number;
  discount: number;
  description?: string;
  media: IMediaItem[];
  sku: string;
  stock: number;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductPayload {
  name: string;
  category: string;
  price: number;
  selling_price: number;
  discount?: number;
  description?: string;
  media: string[];
  sku: string;
  stock: number;
  isActive?: boolean;
}

export interface IUpdateProductPayload {
  name?: string;
  category?: string;
  price?: number;
  selling_price?: number;
  discount?: number;
  description?: string;
  media?: string[];
  sku?: string;
  stock?: number;
  isActive?: boolean;
}

export interface ICreateProductResponse {
  message: string;
  data?: IProductItem;
}

export interface IUpdateProductResponse {
  message: string;
  data?: IProductItem;
}

export interface IGetProductByIdResponse {
  message: string;
  data: IProductItem | null;
}

export interface IProductPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetProductsResponse {
  message: string;
  data: {
    items: IProductItem[];
    meta: IProductPaginationMeta;
  } | null;
}

export interface IProductDocument extends IProduct, mongoose.Document {}
