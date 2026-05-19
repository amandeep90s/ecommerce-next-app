import mongoose from 'mongoose';

export interface ICategory {
  id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  deleteAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Serialized category item as returned from the API (JSON-safe)
export interface ICategoryItem {
  id: string;
  name: string;
  slug: string;
  deleteAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCategoryPayload {
  name: string;
}

export interface ICreateCategoryResponse {
  message: string;
  data?: ICategoryItem;
}

export interface IUpdateCategoryPayload {
  name: string;
}

export interface IUpdateCategoryResponse {
  message: string;
  data?: ICategoryItem;
}

export interface IGetCategoryByIdResponse {
  message: string;
  data: ICategoryItem | null;
}

export interface ICategoryDocument extends ICategory, mongoose.Document {}
