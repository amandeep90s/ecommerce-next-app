import mongoose from 'mongoose';

import { ICategory } from './category.types';
import { IMedia } from './media.types';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string | ICategory;
  price: number;
  selling_price: number;
  discount: number;
  description?: string;
  media: (string | IMedia)[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  slug: string;
  category: string;
  price: number;
  selling_price: number;
  discount?: number;
  description?: string;
  media: string[];
}

export interface IProductUpdate {
  name?: string;
  slug?: string;
  category?: string;
  price?: number;
  selling_price?: number;
  discount?: number;
  description?: string;
  media?: string[];
}

export interface IProductResponse extends IProduct {
  category: ICategory;
  media: IMedia[];
}

export interface IProductDocument extends IProduct, mongoose.Document {}
