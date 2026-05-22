import mongoose from 'mongoose';

import { IMediaItem } from './media.types';
import { IProductItem } from './product.types';

export interface IProductVariant {
  id: string;
  product: string | IProductItem;
  color: string;
  size: string;
  price: number;
  selling_price: number;
  discount: number;
  media: (string | IMediaItem)[];
  sku: string;
  stock: number;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized product item as returned from the API (JSON-safe)
export interface IProductVariantItem {
  id: string;
  product: IProductItem;
  color: string;
  size: string;
  price: number;
  selling_price: number;
  discount: number;
  media: IMediaItem[];
  sku: string;
  stock: number;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProductVariantPayload {
  product: string;
  color: string;
  size: string;
  price: number;
  selling_price: number;
  discount?: number;
  media: string[];
  sku: string;
  stock: number;
  isActive?: boolean;
}

export interface IUpdateProductVariantPayload {
  product?: string;
  color?: string;
  size?: string;
  price?: number;
  selling_price?: number;
  discount?: number;
  media?: string[];
  sku?: string;
  stock?: number;
  isActive?: boolean;
}

export interface ICreateProductVariantResponse {
  message: string;
  data?: IProductVariantItem;
}

export interface IUpdateProductVariantResponse {
  message: string;
  data?: IProductVariantItem;
}

export interface IGetProductVariantByIdResponse {
  message: string;
  data: IProductVariantItem | null;
}

export interface IProductVariantPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetProductVariantsResponse {
  message: string;
  data: {
    items: IProductVariantItem[];
    meta: IProductVariantPaginationMeta;
  } | null;
}

export interface IProductVariantDocument extends IProductVariant, mongoose.Document {}
