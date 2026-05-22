import mongoose from 'mongoose';

export interface ICoupon {
  id: string;
  code: string;
  discount: number;
  minimumPurchase: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized product item as returned from the API (JSON-safe)
export interface ICouponItem {
  id: string;
  code: string;
  discount: number;
  minimumPurchase: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCouponPayload {
  code: string;
  discount: number;
  minimumPurchase: number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
}

export interface IUpdateCouponPayload {
  code?: string;
  discount?: number;
  minimumPurchase?: number;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
}

export interface ICreateCouponResponse {
  message: string;
  data?: ICouponItem;
}

export interface IUpdateCouponResponse {
  message: string;
  data?: ICouponItem;
}

export interface IGetCouponByIdResponse {
  message: string;
  data: ICouponItem | null;
}

export interface ICouponPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IGetCouponsResponse {
  message: string;
  data: {
    items: ICouponItem[];
    meta: ICouponPaginationMeta;
  } | null;
}

export interface ICouponDocument extends ICoupon, mongoose.Document {}
